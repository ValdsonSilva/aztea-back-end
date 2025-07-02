import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const UserModel = {

    findAll: async (): Promise<User[] | null> => {
        return await prisma.user.findMany();
    },

    findById: async (id: string): Promise<User | null> => {
        return await prisma.user.findUnique({where: { id }});
    },

    create: async (data: {
        password: string;
        name: string;
        email: string;
        bio?: string;
        avatarUrl?: string;
        userType: string
    }): Promise<User | null> => {
        return await prisma.user.create({data});
    },

    update: async (id: string, data: Partial<User>): Promise<User | null> => {
        const exists = await prisma.user.findUnique({ where: { id } });
        if (!exists) return null;

        return await prisma.user.update({
            where: { id },
            data,
        });
    },

    delete: async (id: string): Promise<User | null> => {
        const exists = await prisma.user.findUnique({ where: { id } });
        if (!exists) return null;

        return await prisma.user.delete({ where: { id } });
    }

}