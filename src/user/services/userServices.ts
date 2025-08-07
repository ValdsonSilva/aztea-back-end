import { PrismaClient, User } from '@prisma/client';
import { UserModel } from '../../user/models/UserModel.js'; // Update the path if the file exists elsewhere
import fs from 'fs';
import { generateSafeName } from '../../shared/utils/generateSafeName.js';
import { getMediaType } from '../../shared/services/getMediaType.js';
import cloudinary from '../../shared/config/cloudinary.js';
import { uploadFile } from '../../shared/services/UploadFileService.js';
import { isOfLegalAge } from '../../shared/utils/validateAge.js';
import { IUserType } from '../controllers/UserController.js';

const prisma = new PrismaClient();

interface UpdateAvatarDTO {
  user: User; 
  avatarFiles: Express.Multer.File[];
}

export const userServices = {

  async deleteUser(requesterId: string, targetUserId: string): Promise<User> {

      const targetUser = await UserModel.findById(targetUserId);

      if (!targetUser) {
        throw { status: 404, message: "Usuário não encontrado" };
      }

      const userRequester = await UserModel.findById(requesterId)

      if (!userRequester) {
        throw {status: 404, message: "Usuário requisitante não encontrado"}
      }

      const isAnotherUserTryingToDeleteAccount = userRequester?.isAdmin !== true;

      if (isAnotherUserTryingToDeleteAccount) {
        throw { status: 403, message: "Ação restrita. Apenas admins podem deletar artistas" };
      }

      const user = await UserModel.delete(targetUser.id);

      if (!user) {
        throw { status: 500, message: "Erro ao deletar o usuário." };
      }

      return user;
  },

  async updateAvatar({ user, avatarFiles }: UpdateAvatarDTO): Promise<User> {

    if (!avatarFiles || avatarFiles.length === 0) {
      throw {status: 400, message: 'Nenhum arquivo de avatar enviado'};
    }

    const safeName = generateSafeName(user.name);
    let updatedUser = user;

    for (const avatar of avatarFiles) {
      const type = getMediaType(avatar.mimetype);

      try {
        // Remove avatar anterior se existir
        if (user.publicId) {
          await cloudinary.uploader.destroy(user.publicId);
          console.log('Avatar antigo deletado:', user.publicId);
        }

        // Upload do novo avatar
        const result = await uploadFile(avatar.path, safeName, type);

        console.log('Avatar enviado:', result.original_filename);

        // Atualiza o usuário com o novo avatar
        updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            avatarUrl: result.secure_url,
            publicId: result.public_id,
          },
        });

        // Remove o arquivo local temporário
        fs.unlinkSync(avatar.path);
      } catch (error) {
        console.error(`Erro ao processar avatar ${avatar.originalname}:`, error);
        throw {status:500, message: 'Erro ao atualizar o avatar'};
      }
    }

    return updatedUser;
  },

  async createUser(userData: User): Promise<User> {

    const minAge = 18;

    // Verifica se os campos obrigatórios estão presentes
    if (!userData.email || !userData.password || !userData.name || !userData.birthDate) {
      console.log("Data de nascimento:", userData.birthDate)
      throw { status: 400, message: "Email, senha, nome e data de nascimento são obrigatórios" };
    }

    if (!userData.termsAcceptedAt || !userData.privacyAcceptedAt) {
      throw {status: 404, message: "Termo de aceite não assinado"}
    }

    if (!userData.isAdmin && userData.categoryId === "") {
      throw {status: 403, message: "É obrigatório informar uma categoria de usuário"}
    } 

    const isValidDate = (dateStr: any) => !isNaN(Date.parse(dateStr));

    if (userData.termsAcceptedAt !== undefined && isValidDate(userData.termsAcceptedAt)) {
        userData.termsAcceptedAt = new Date(userData.termsAcceptedAt);
    }

    if (userData.birthDate !== undefined && isValidDate(userData.birthDate)) {
        userData.birthDate = new Date(userData.birthDate);
    }

    if (userData.privacyAcceptedAt !== undefined && isValidDate(userData.privacyAcceptedAt)) {
        userData.privacyAcceptedAt = new Date(userData.privacyAcceptedAt);
    }

    const IsUserUnderLimitAge = isOfLegalAge(userData.birthDate, minAge);

    if (!IsUserUnderLimitAge) {
      throw {status: 403, message: "Usuário menor de 18 anos não pode acessar a plataforma"}
    }

    const user = await UserModel.create(userData);

    return user;
  },

  async updateUser(id: string, userData: Partial<IUserType>) {

        if (!id) return { status: 400, data: { message: "Id não informado" } };

        const {
            name, password, email, bio,
            termsAcceptedAt, privacyAcceptedAt, termsVersionAccepted,
            city, country, state, region
        } = userData;

        const data: Partial<User> = {};
        if (name !== undefined) data.name = name;
        if (password !== undefined) data.password = password;
        if (email !== undefined) data.email = email;
        if (bio !== undefined) data.bio = bio;
        if (termsAcceptedAt !== undefined) data.termsAcceptedAt = termsAcceptedAt;
        if (privacyAcceptedAt !== undefined) data.privacyAcceptedAt = privacyAcceptedAt;
        if (termsVersionAccepted !== undefined) data.termsVersionAccepted = termsVersionAccepted;
        if (city !== undefined) data.city = city;
        if (country !== undefined) data.country = country;
        if (state !== undefined) data.state = state;
        if (region !== undefined) data.region = region;

        if (Object.keys(data).length === 0) {
            return { status: 400, data: { message: "Deve-se informar algum campo" } };
        }

        const foundUser = await UserModel.findById(id);
        if (!foundUser) {
            return { status: 404, data: { message: "Usuário não encontrado" } };
        }

        await UserModel.update(id, data);

        return { status: 200, data: { message: "Usuário atualizado com sucesso" } };
  }
};
