import { PrismaClient, User } from '@prisma/client';
import { UserModel } from '../../user/models/UserModel.js'; // Update the path if the file exists elsewhere
import fs from 'fs';
import { generateSafeName } from '../../shared/utils/generateSafeName.js';
import { getMediaType } from '../../shared/services/getMediaType.js';
import cloudinary from '../../shared/config/cloudinary.js';
import { uploadFile } from '../../shared/services/UploadFileService.js';
import { error } from 'console';
import allowedUserTypes from '../../shared/utils/allowedUserTypes.js';
import { isOfLegalAge } from '../../shared/utils/validateAge.js';
import { json } from 'stream/consumers';

const prisma = new PrismaClient();

interface UpdateAvatarDTO {
  user: User; 
  avatarFiles: Express.Multer.File[];
}

export const userServices = {

  async deleteUser(requesterId: string, targetUserId: string): Promise<User> {

      const targetUser = await UserModel.findById(targetUserId);

      if (!targetUser) {
        throw { status: 404, message: "Usuário não encontrado." };
      }

      const userRequester = await UserModel.findById(requesterId)

      if (!userRequester) {
        throw {status: 404, message: "Usuário requisitante não encontrado"}
      }

      const isAnotherUserTryingToDeleteArtist = userRequester?.userType !== "admin";

      if (isAnotherUserTryingToDeleteArtist) {
        throw { status: 403, message: "Ação restrita. Apenas admins podem deletar artistas." };
      }

      const user = await UserModel.delete(targetUser.id);

      if (!user) {
        throw { status: 500, message: "Erro ao deletar o usuário." };
      }

      return user;
  },

  async updateAvatar({ user, avatarFiles }: UpdateAvatarDTO): Promise<User> {
    if (!avatarFiles || avatarFiles.length === 0) {
      throw new Error('Nenhum arquivo de avatar enviado.');
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
        throw new Error('Erro ao atualizar o avatar.');
      }
    }

    return updatedUser;
  },

  async createUser(userData: User): Promise<User> {

    const minAge = 18;

    // Verifica se os campos obrigatórios estão presentes
    if (!userData.email || !userData.password || !userData.name || !userData.userType) {
        throw { status: 400, message: "Email, senha, nome e o tipo de usuário são obrigatórios" };
    }

    const IsUserUnderLimitAge = isOfLegalAge(userData.birthDate, minAge);

    if (!IsUserUnderLimitAge) {
      throw {status: 403, message: "Usuário menor de 18 anos não pode acessar a plataforma"}
    }

    const permissionCheck = userData.userType && allowedUserTypes.includes(userData.userType);

    if (!permissionCheck) {
      throw {status: 404, message: "Tipo de usuário inexistente"};
    } 

    const user = await UserModel.create(userData);

    return user;
  },

  // outros métodos: findById, findByEmail, changePassword, etc.
};
