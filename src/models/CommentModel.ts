import { Prisma, PrismaClient, Comment } from "@prisma/client";

const prisma = new PrismaClient();

export const CommentModel = {
    // todos esses métodos serão chamados no controller de content
    findAll: async (): Promise<Comment[] | null> => {
        return await prisma.comment.findMany();
    },

    // pelo id do comentário
    findById: async (id: string): Promise<Comment | null> => {
        return await prisma.comment.findUnique({where: {id}});
    },

    // pelo id do conteúdo
    findByContentId: async (contentId: string): Promise<Comment[] | null> => {
        return await prisma.comment.findMany({where: {contentId}});
    },

    findByUserId: async (userId: string): Promise<Comment[] | null> => {
        return await prisma.comment.findMany({where: {userId}});
    },

    create: async (data: Prisma.CommentCreateInput): Promise<Comment | null> => {
        return await prisma.comment.create({data});
    },

    update: async (id: string, data: Prisma.CommentUpdateInput): Promise<Comment | null> => {
        return await prisma.comment.update({where: {id}, data});
    },

    delete: async (id: string): Promise<Comment | null> => {
        return await prisma.comment.delete({where: {id}});
    }
}