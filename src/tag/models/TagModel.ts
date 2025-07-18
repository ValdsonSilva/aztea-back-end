import { PrismaClient, Tag, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const TagModel = {
    findAll: async (): Promise<Tag[] | null> => {
            return await prisma.tag.findMany();
    },
    
    findById: async (id: string): Promise<Tag | null> => {
        return await prisma.tag.findUnique({where: { id }});
    },

    create: async (data: Prisma.TagCreateInput): Promise<Tag | null> => {
        return await prisma.tag.create({data});
    },

    update: async (id: string, data: Prisma.TagUpdateInput): Promise<Tag | null> => {
        const exists = await prisma.tag.findUnique({ where: { id } });
        if (!exists) return null;

        return await prisma.tag.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string): Promise<Tag | null> => {
        const exists = await prisma.tag.findUnique({ where: { id } });
        if (!exists) return null;

        return await prisma.tag.delete({ where: { id } });
    }   
}