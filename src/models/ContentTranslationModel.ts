import { Prisma, PrismaClient, ContentTranslation } from "@prisma/client";

const prisma = new PrismaClient();

export const ContentTranslationModel = {

    findAll: async (): Promise<ContentTranslation[] | null> => {
        return await prisma.contentTranslation.findMany();
    },

    findById: async (id: string): Promise<ContentTranslation | null> => {
        return await prisma.contentTranslation.findUnique({
            where: { id },
        });
    },

    // principal para buscar a tradução de um conteúdo
    findByContentId: async (contentId: string): Promise<ContentTranslation[] | null> => {
        return await prisma.contentTranslation.findMany({
            where: { contentId },
        });
    },

    create: async (data: Prisma.ContentTranslationCreateInput): Promise<ContentTranslation> => {
        return await prisma.contentTranslation.create({
            data,
        });
    },

    update: async (id: string, data: Prisma.ContentTranslationUpdateInput): Promise<ContentTranslation> => {
        return await prisma.contentTranslation.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string): Promise<ContentTranslation> => {
        return await prisma.contentTranslation.delete({
            where: { id },
        });
    },
};