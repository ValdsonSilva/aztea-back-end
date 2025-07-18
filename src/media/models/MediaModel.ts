import { PrismaClient, Media, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const MediaModel = {
    // todos esses métodos serão chamados no controller de content
    findAll: async (): Promise<Media[] | null> => {
        return await prisma.media.findMany();
    },

    findById: async (id: string): Promise<Media | null> => {
        return await prisma.media.findUnique({where: {id}});
    },

    create: async (data: Prisma.MediaCreateInput): Promise<Media | null> => {
        return await prisma.media.create({data});
    },

    update: async (id: string, data: Prisma.MediaUpdateInput): Promise<Media | null> => {
        return await prisma.media.update({where: {id}, data});
    },

    delete: async (id: string): Promise<Media | null> => {
        return await prisma.media.delete({where: {id}});
    }
}