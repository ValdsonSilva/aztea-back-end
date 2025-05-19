import { Content, Prisma, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const ContentModel = {

    findAll: async (params?: {
        categoryId?: string;
        userId?: string;
        published?: boolean;
        skip?: number;
        take?: number;
    }): Promise<Content[]> => {

        const { categoryId, userId, published, skip, take } = params || {};

        return await prisma.content.findMany({
            where: {
                categoryId,
                userId,
                published,
        },
            skip,
            take,
            orderBy: { createdAt: 'desc' }
        });
    },

    findById: async (id: string): Promise<Content | null> => {
        return await prisma.content.findUnique({
            where: { id },
            include: {
                category: true,
                user: true,
                series: true,
                media: true,
                tags: true,
                comments: true,
                favorites: true,
                translations: true,
            }
        });
    },

    // Criar novo conteúdo
    create: async (data: Prisma.ContentCreateInput): Promise<Content> => {
        return await prisma.content.create({ data });
    },

    // Atualizar conteúdo existente
    update: async (id: string, data: Prisma.ContentUpdateInput): Promise<Content | null> => {
        const exists = await prisma.content.findUnique({ where: { id } });
        if (!exists) return null;
        return await prisma.content.update({
        where: { id },
        data,
        });
    },

    // Deletar conteúdo por id
    delete: async (id: string): Promise<Content | null> => {
        const exists = await prisma.content.findUnique({ where: { id } });
        if (!exists) return null;
        return await prisma.content.delete({ where: { id } });
    },

    // Incrementar contador de views
    incrementViews: async (id: string): Promise<Content | null> => {
        return await prisma.content.update({
            where: { id },
            data: { views: { increment: 1 } },
        });
    },

    // Incrementar contador de votes
    incrementVotes: async (id: string): Promise<Content | null> => {
        return await prisma.content.update({
            where: { id },
            data: { votes: { increment: 1 } },
        });
    },

    // Buscar conteúdos por tag
    findByTag: async (tagName: string): Promise<Content[]> => {
        return await prisma.content.findMany({
            where: {
                tags: {
                    some: {
                        tag: {
                            name: tagName,
                        },
                    },
                },
            },
                include: {
                    tags: true,
                },
            });
    },
}

