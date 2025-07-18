import { NotificationModel } from "../models/NotificationModel.js";
import { Request, Response } from "express";

const NotificationController = {

    index: async (req: Request, res: Response) => {

        try {
            const notifications = await NotificationModel.findAll();
            if (!notifications) res.status(404).json({message: "Notificação não encontrada"});
            res.status(200).json(notifications);

        } catch (error) {
            console.error("Erro no NotificationController.index:", error);
            res.status(500).json({message: "Erro ao listar notificações", error});
        }
    },

    show: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) res.status(400).json({message: "ID não informado"});

        try {
            const notification = await NotificationModel.findById(id);
            if (!notification) res.status(404).json({message: "Notificação não encontrada"});
            res.status(200).json(notification);

        } catch (error) {
            console.error("Erro no NotificationController.show:", error);
            res.status(500).json({message: "Erro ao listar notificações", error});
        }
    },

    store: async (req: Request, res: Response) => {
        const { message, user } = req.body;
        if (!message || !user) res.status(404).json({message: "Mensagem ou Id usuário não informados"});

        try {
            const notification = await NotificationModel.create({ message, user });
            if (!notification) res.status(404).json({message: "Erro ao criar notificação"});
            res.status(200).json(notification);

        } catch (error) {
            console.error("Erro no NotificationController.store:", error);
            res.status(500).json({message: "Erro ao criar notificação", error});
        }
    },

    update: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { message, user } = req.body;
        if (!id || !message || !user) res.status(404).json({message: "ID, mensagem ou Id usuário não informados"});

        try {
            const notification = await NotificationModel.update(id, { message, user });
            if (!notification) res.status(404).json({message: "Erro ao atualizar notificação"});
            res.status(200).json(notification);

        } catch (error) {
            console.error("Erro no NotificationController.update:", error);
            res.status(500).json({message: "Erro ao atualizar notificação", error});
        }
    },

    destroy: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) res.status(404).json({message: "ID não informado"});

        try {
            const notification = await NotificationModel.delete(id);
            if (!notification) res.status(404).json({message: "Erro ao deletar notificação"});
            res.status(200).json(notification);

        } catch (error) {
            console.error("Erro no NotificationController.destroy:", error);
            res.status(500).json({message: "Erro ao deletar notificação", error});
        }
    }
}

export default NotificationController;