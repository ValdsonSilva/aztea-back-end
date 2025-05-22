import { PrismaClient, Notification, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const NotificationModel = {
    // todos esses métodos serão chamados no controller de notification
    findAll: async (): Promise<Notification[] | null> => {
        return await prisma.notification.findMany();
    },

    findById: async (id: string): Promise<Notification | null> => {
        return await prisma.notification.findUnique({ where: { id } });
    },

    create: async (data: Prisma.NotificationCreateInput): Promise<Notification | null> => {
        return await prisma.notification.create({ data });
    },

    update: async (id: string, data: Prisma.NotificationUpdateInput): Promise<Notification | null> => {
        return await prisma.notification.update({ where: { id }, data });
    },

    delete: async (id: string): Promise<Notification | null> => {
        return await prisma.notification.delete({ where: { id } });
    }
};