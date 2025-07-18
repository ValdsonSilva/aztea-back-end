import { Prisma, PrismaClient, Series } from "@prisma/client";

const prisma = new PrismaClient();

export const SerieModel = {
    // findAll
    findAll: async (): Promise<Series[] | null> => {
        return await prisma.series.findMany();
    },
    // findById
    findById: async (id: string): Promise<Series | null> => {
        return await prisma.series.findUnique({where: {id}});
    },
    // create
    create: async (data: Prisma.SeriesCreateInput): Promise<Series | null> => {
        return await prisma.series.create({data});
    },
    // update
    update: async (id: string, data: Prisma.SeriesUpdateInput): Promise<Series | null> => {
        const exists = await prisma.series.findUnique({where: {id}})
        if (!exists) return null

        return await prisma.series.update({where: {id}, data});
    },
    // delete
    delete: async (id: string): Promise<Series | null> => {
        const exists = await prisma.series.findUnique({where: {id}})
        if (!exists) return null

        return await prisma.series.delete({where: {id}});
    },
}