import { Prisma, PrismaClient, Submission } from "@prisma/client";

const prisma = new PrismaClient();

// esse model não será utilizado na primeira versão do projeto, mas será útil para o futuro
export const SubmissionModel = {

    findAll: async (): Promise<Submission[] | null> => {
        return await prisma.submission.findMany();
    },

    findById: async (id: string): Promise<Submission | null> => {
        return await prisma.submission.findUnique({
            where: { id }
        });
    },

    finByUserId: async (userId: string): Promise<Submission[] | null> => {
        return await prisma.submission.findMany({
            where: { userId }
        });
    },

    create: async (data: Prisma.SubmissionCreateInput): Promise<Submission> => {
        return await prisma.submission.create({
            data
        });
    },

    update: async (id: string, data: Prisma.SubmissionUpdateInput): Promise<Submission> => {
        return await prisma.submission.update({
            where: { id },
            data
        });
    },

    delete: async (id: string): Promise<Submission> => {
        return await prisma.submission.delete({
            where: { id }
        });
    },
};