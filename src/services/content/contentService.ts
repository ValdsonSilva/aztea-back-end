import { Prisma, PrismaClient } from "@prisma/client";
import { generateSafeName } from "../../utils/generateSafeName.js";
import { getMediaType } from "../getMediaType.js";
import { uploadFile } from "../UploadFileService.js";
import fs from "fs";

export interface ITranslationDTO {
  language: string;
  title: string;
  description: string;
}

export interface ITagDTO {
  id?: string;
  name?: string;
}

export interface ICreateContentDTO {
  userId: string;
  title: string;
  description?: string;
  contentType: string;
  categoryId: string;
  translations?: ITranslationDTO[];
  tags?: ITagDTO[];
  files?: Express.Multer.File[];
}

const prisma = new PrismaClient();

export const contentService = {
    async createContent(data: ICreateContentDTO) {
        const { userId, title, contentType, categoryId, description, translations, tags, files } = data;

        // Validações essenciais
        if (!userId || !title || !contentType || !categoryId) {
            throw { status: 400, message: 'Campos obrigatórios faltando.' };
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw { status: 404, message: 'Usuário não encontrado.' };
        if (!user.isAdmin) throw { status: 403, message: 'Só administradores podem postar um conteúdo.' };

        const content = await prisma.content.create({
            data: {
                title,
                contentType,
                description,
                category: { connect: { id: categoryId } },
                user: { connect: { id: userId } },
            },
        });

        // Upload de mídias
        if (files && files.length > 0) {
            const safeName = generateSafeName(user.name);
            for (const file of files) {
                const type = getMediaType(file.mimetype);
                const result = await uploadFile(file.path, safeName, type)

                await prisma.media.create({
                    data: {
                        content: { connect: { id: content.id } },
                        url: result.secure_url,
                        publicId: result.public_id,
                        type,
                    },
                });

                fs.unlinkSync(file.path);
            }
        }

        // Traduções
        if (translations && Array.isArray(translations)) {
            for (const translation of translations) {
            await prisma.contentTranslation.create({
                data: {
                    language: translation.language,
                    title: translation.title,
                    description: translation.description,
                    content: { connect: { id: content.id } },
                },
            });
            }
        }

        // Tags
        if (tags && Array.isArray(tags)) {
            for (const tag of tags) {
                let tagId: string | undefined;

                if (tag.id) {
                    tagId = tag.id;
                } else if (tag.name) {
                    const existing = await prisma.tag.findUnique({ where: { name: tag.name } });
                    tagId = existing ? existing.id : (await prisma.tag.create({ data: { name: tag.name } })).id;
                }

                if (tagId) {
                    await prisma.contentTag.create({
                        data: { contentId: content.id, tagId },
                    });
                }
            }
        }

        return content;
    }
};