import { ContentTranslationModel } from "../models/ContentTranslationModel.js";
import { Request, Response } from "express";

const ContentTranslationController = {

    index: async (req: Request, res: Response) => {
        try {
            const contentTranslations = await ContentTranslationModel.findAll();
            res.status(200).json(contentTranslations);
        } catch (error) {
            console.error("Erro no ContentTranslationController.index:", error);
            res.status(500).json({ message: "Erro ao listar os conteúdos traduzidos", error });
        }
    },

    show: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) res.status(400).json({ message: "ID do conteúdo traduzido não fornecido" });
        try {
            const contentTranslation = await ContentTranslationModel.findById(id);
            if (!contentTranslation) {
                res.status(404).json({ message: "Conteúdo traduzido não encontrado" });
            }
            res.status(200).json(contentTranslation);
        } catch (error) {
            console.error("Erro no ContentTranslationController.show:", error);
            res.status(500).json({ message: "Erro ao buscar o conteúdo traduzido", error });
        }
    },

    showByContentId: async (req: Request, res: Response) => {
        const { contentId } = req.params;
        if (!contentId) res.status(400).json({ message: "ID do conteúdo não fornecido" });
        try {
            const contentTranslation = await ContentTranslationModel.findByContentId(contentId);
            if (!contentTranslation) res.status(404).json({ message: "Conteúdo traduzido não encontrado" });
            res.status(200).json(contentTranslation);
        } catch (error) {
            console.error("Erro no ContentTranslationController.showByContentId:", error);
            res.status(500).json({ message: "Erro ao buscar o conteúdo traduzido", error });
        }
    },

    store: async (req: Request, res: Response) => {
        const { language, title, content } = req.body;
        if (!content || !language || !title) res.status(400).json({ message: "Dados incompletos para criar a tradução" });

        try {
            const newContentTranslation = await ContentTranslationModel.create({
                language,
                title,
                content,
            });
            if (!newContentTranslation) res.status(400).json({ message: "Erro ao criar a tradução" });
            res.status(201).json(newContentTranslation);
        } catch (error) {
            console.error("Erro no ContentTranslationController.store:", error);
            res.status(500).json({ message: "Erro ao criar a tradução", error });
        }
    },

    update: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { language, title, content } = req.body;
        if (!id || !language || !title || !content) res.status(400).json({ message: "Dados incompletos para atualizar a tradução" });

        try {
            const updatedContentTranslation = await ContentTranslationModel.update(id, {
                language,
                title,
                content,
            });
            if (!updatedContentTranslation) res.status(404).json({ message: "Conteúdo traduzido não encontrado" });
            res.status(200).json(updatedContentTranslation);
        } catch (error) {
            console.error("Erro no ContentTranslationController.update:", error);
            res.status(500).json({ message: "Erro ao atualizar a tradução", error });
        }
    },

    delete: async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) res.status(400).json({ message: "ID do conteúdo traduzido não fornecido" });

        try {
            const deletedContentTranslation = await ContentTranslationModel.delete(id);
            if (!deletedContentTranslation) res.status(404).json({ message: "Conteúdo traduzido não encontrado" });
            res.status(200).json(deletedContentTranslation);
        } catch (error) {
            console.error("Erro no ContentTranslationController.delete:", error);
            res.status(500).json({ message: "Erro ao deletar a tradução", error });
        }
    }
};

export default ContentTranslationController;