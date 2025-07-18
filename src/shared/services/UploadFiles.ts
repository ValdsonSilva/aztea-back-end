import { PrismaClient, User } from "@prisma/client";
import { generateSafeName } from "../utils/generateSafeName.js";
import { getMediaType } from "./getMediaType.js";
import { uploadFile } from "./UploadFileService.js";
import fs from "fs";

const prisma = new PrismaClient()

interface IUploadFileDTO {
    user: User,
    data: User;
    avatarUrl?: Express.Multer.File[];
}

export const uploadFiles = async ({user, data, avatarUrl}:IUploadFileDTO) => {
    if (avatarUrl && avatarUrl.length > 0) {
        console.log("Entrou em mídia");

        const safeName = generateSafeName(data.name) 

        await Promise.all(
            avatarUrl.map(async (avatar) => {
                try {
                    console.log("Processando:", avatar.originalname);
                    const type = getMediaType(avatar.mimetype);

                    const result = await uploadFile(avatar.path, safeName, type);

                    console.log("Arquivo enviado:", result.secure_url);

                    await prisma.user.update({
                        where: { id: user?.id },
                        data: { avatarUrl: result.secure_url, publicId: result.public_id },
                    });

                    fs.unlinkSync(avatar.path);

                } catch (error) {
                    console.error(`Erro ao subir arquivo ${avatar.originalname}:`, error);
                }
            })
        );
    }
}
            