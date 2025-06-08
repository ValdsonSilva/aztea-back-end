import { CommentModel } from "../models/CommentModel.js";
import { Request, Response } from "express";
import { NotificationModel } from "../models/NotificationModel.js";
import { connect } from "http2";

const CommentController = {

    index: async (req: Request, res: Response) => {
        try {
            const comments = await CommentModel.findAll();
            if (!comments) res.status(404).json({ message: "Comentários não encontrados" });
            res.status(200).json(comments);
        } catch (error) {
            console.error("Erro no CommentController.index:", error);
            res.status(500).json({ message: "Erro ao listar comentários", error });
        }
    },

    show: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) res.status(404).json({ message: "ID do comentário não informado" });

        try {
            const comment = await CommentModel.findById(id);
            if (!comment) res.status(404).json({ message: "Comentário não encontrado" });
            res.status(200).json(comment);

        } catch (error) {
            console.error("Erro no CommentController.show:", error);
            res.status(500).json({ message: "Erro ao listar comentário", error });
        }
    },

    showByContentId: async (req: Request, res: Response) => {
        const { contentId } = req.params;
        if (!contentId) res.status(404).json({ message: "ID do conteúdo não informado" });

        try {
            const comments = await CommentModel.findByContentId(contentId);
            if (!comments) res.status(404).json({ message: "Comentários não encontrados" });
            res.status(200).json(comments);
        } catch (error) {
            console.error("Erro no CommentController.showByContentId:", error);
            res.status(500).json({ message: "Internal server error", error });
        }
    },

    showByUserId: async (req: Request, res: Response) => {
        const { userId } = req.params;
        if (!userId) res.status(404).json({ message: "ID do usuário não informado" });

        try {
            const comments = await CommentModel.findByUserId(userId);
            if (!comments) res.status(404).json({ message: "Comentários não encontrados" });
            res.status(200).json(comments);
        } catch (error) {
            console.error("Erro no CommentController.showByUserId:", error);
            res.status(500).json({ message: "Internal server error", error });
        }
    },

    store: async (req: Request, res: Response) => {
        const { contentId, userId, text } = req.body;
        if (!contentId || !userId || !text) res.status(404).json({ message: "Dados do comentário não informados" });

        try {
            const comment = await CommentModel.create({text, content: {connect: {id: contentId}}, user: {connect: {id: userId}}});
            if (comment) {
                const notification = await NotificationModel.create({ message: `New comment on your last post`, user: {connect: {id: userId}} });
            }
            res.status(201).json(comment);
        } catch (error) {
            console.error("Erro no CommentController.store:", error);
            res.status(500).json({ message: "Erro ao criar comentário", error });
        }
    },

    update: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { content, user, text } = req.body;
        if (!id || !content || !user || !text) res.status(404).json({ message: "Dados do comentário não informados" });

        try {
            const comment = await CommentModel.update(id, {text, content, user});
            if (!comment) res.status(404).json({ message: "Comentário não encontrado" });
            res.status(200).json(comment);
        } catch (error) {
            console.error("Erro no CommentController.update:", error);
            res.status(500).json({ message: "Erro ao atualizar comentário", error });
        }
    },

    destroy: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) res.status(404).json({ message: "ID do comentário não informado" });

        try {
            const comment = await CommentModel.delete(id);
            if (!comment) res.status(404).json({ message: "Comentário não encontrado" });
            res.status(200).json(comment);
        } catch (error) {
            console.error("Erro no CommentController.destroy:", error);
            res.status(500).json({ message: "Erro ao deletar comentário", error });
        }
    }
}

export default CommentController;