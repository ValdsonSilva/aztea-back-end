import { PrismaClient, Favorite, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const FavoriteModel = {
    
    findAll: async (): Promise<Favorite[] | null> => {
        return await prisma.favorite.findMany();
    },

    findById: async (id: string): Promise<Favorite | null> => {
        return await prisma.favorite.findUnique({where: {id}});
    },

    create: async (data: Prisma.FavoriteCreateInput): Promise<Favorite | null> => {
        return await prisma.favorite.create({data});
    },

    update: async (id: string, data: Prisma.FavoriteUpdateInput): Promise<Favorite | null> => {
        return await prisma.favorite.update({where: {id}, data});
    },

    delete: async (id: string): Promise<Favorite | null> => {
        return await prisma.favorite.delete({where: {id}});
    }
}