import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

export const CategoryModel = {

    findAll: async (): Promise<Category[] | null> => {
        return await prisma.category.findMany();
    },

    findById: async (id: string): Promise<Category | null> => {
        return await prisma.category.findUnique({ where: {id} });   
    },

    create: async (data: {
        name: string;
    }): Promise<Category | null> => {
        return await prisma.category.create({data});
    },

    update: async (id: string, data: Partial<Category>): Promise<Category | null> => {
        return await prisma.category.update({
            where: {id},
            data,
        })
    },

    delete: async (id: string): Promise<Category | null> => {
        return await prisma.category.delete({where: {id}});
    }
}