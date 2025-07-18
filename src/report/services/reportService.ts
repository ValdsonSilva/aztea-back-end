import { PrismaClient } from "@prisma/client";
import { ReportModel } from "../models/ReportModels.js";
import { UserModel } from "../../user/models/UserModel.js";

const prisma = new PrismaClient();

export interface IReportDTO {
    description?: string,
    moderatorComment?: string,
    moderatorId: string,
    userId: string,
    contentId: string,
    deletedAt?: Date
}

const permissionsToModerate: Array<string> = ["admin", "developer", "founder", "reviewer"];


export const reportService = {
    async createReport(data: IReportDTO) {
        const { description, moderatorComment, moderatorId, userId, contentId, deletedAt } = data;

        // Essential validations
        if (!userId || !contentId) {
            throw { status: 400, message: 'Campos obrigatórios não informados.' };
        }

        const reporter = await prisma.user.findUnique({ where: { id: userId } });

        if (!reporter) throw { status: 404, message: 'Ususário não encontrado.' };

        const report = await ReportModel.create({
                description,
                moderatorComment,
                moderatorId,
                user: { connect: { id: userId } },
                content: { connect: { id: contentId } },
                deletedAt,
            },
        );

        return report;
    },

    async updateReport(id: string, data: IReportDTO) {
        const { description, moderatorComment, moderatorId, userId, contentId, deletedAt } = data;

        // Essential validations
        if (!id || !userId || !contentId) {
            throw { status: 400, message: 'Campos obrigatórios não informados.' };
        }

        const report = await ReportModel.update(id, {
            description,
            moderatorComment,
            moderatorId,
            user: { connect: { id: userId } },
            content: { connect: { id: contentId } },
            deletedAt,
        });

        return report;
    },

    async deleteReport(id: string) {
        if (!id) {
            throw { status: 400, message: 'ID da denúncia não informado.' };
        }

        const report = await ReportModel.delete(id);

        if (!report) {
            throw { status: 404, message: 'Denúncia não encontrada.' };
        }

        return report;
    },

    async resolveReport(id: string, moderatorId: string) {

        if (!id || !moderatorId) {
            throw { status: 400, message: 'ID da denúncia não informado.' };
        }

        const moderator = await UserModel.findById(moderatorId);

        if (!moderator || !permissionsToModerate.includes(moderator.userType)) {
            throw { status: 403, message: 'Usuário não tem permissão para resolver denúncias.' };
        }

        const report = await ReportModel.resolveReport(id, moderatorId);

        if (!report) {
            throw { status: 404, message: 'Denúncia não encontrada.' };
        }

        return report;
    },
};