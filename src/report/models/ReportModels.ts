import { Prisma, PrismaClient, Report } from "@prisma/client";

const prisma = new PrismaClient();

export const ReportModel = {

    findAll: async (): Promise<Report[] | null> => {
        return await prisma.report.findMany();
    },

    findById: async (id: string): Promise<Report | null> => {
        return await prisma.report.findUnique({ where: {id} });
    },

    findByUserId: async (id: string): Promise<Report | null> => {
        return await prisma.report.findUnique({where: {id}});
    },

    create: async (data: Prisma.ReportCreateInput): Promise<Report | null> => {
        return await prisma.report.create({data});
    },

    update: async (id: string, data: Prisma.ReportUpdateInput): Promise<Report | null> => {
        return await prisma.report.update({where: {id}, data});
    },

    resolveReport: async (id: string, moderatorId: string): Promise<Report | null> => {
        return await prisma.report.update({
            where: { id },
            data: {resolved: true, moderatorId},
        });
    },

    delete: async (id: string): Promise<Report | null> => {
        return await prisma.report.delete({where: {id}});
    },
};