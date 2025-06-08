import { FavoriteModel } from "../models/FavoriteModel.js";
import { Request, Response } from "express";

const FavoriteController = {

    index: async (req: Request, res: Response) => {

        try {
            const favorites = await FavoriteModel.findAll();
            if (!favorites) res.status(404).json({message: "Favoritos não encontrado"});
            res.status(200).json({favorites});

        } catch (error) {
            console.error("Erro FavoriteController.index:", error);
            res.status(500).json({message: "Erro ao listar favoritos", error});
        }
    },

    show: async (req: Request, res: Response) => {
        const {id} = req.params;

        if (!id) res.status(404).json({message: "Id não informado"});

        try {
            const favorite = await FavoriteModel.findById(id);
            if (!favorite) res.status(404).json({message: "Favorito não encontrado"});
            res.status(200).json({favorite});

        } catch (error) {
            console.error("Erro FavoriteController.show:", error);
            res.status(500).json({message: "Erro ao listar favorito", error});
        }
    },

    store: async (req: Request, res: Response) => {
        const {userId, contentId} = req.body;

        if (!userId || !contentId) res.status(404).json({message: "Ids não informados"});

        const data: any = {userId, contentId};

        try {
            const favorite = await FavoriteModel.create(data);
            if (!favorite) res.status(404).json({message: "Favorito não encontrado"});
            res.status(200).json({favorite});

        } catch (error) {
            console.error("Erro FavoriteController.store:", error);
            res.status(500).json({message: "Erro ao criar favorito", error});
        }
    },

    update: async (req: Request, res: Response) => {
        const {id} = req.params;
        const {data} = req.body;

        if (!id || !data) res.status(404).json({message: "Id ou demais dados não informados"});

        try {
            const favorite = await FavoriteModel.update(id, data);
            if (!favorite) res.status(404).json({message: "Favorito não encontrado"});
            res.status(200).json({favorite});

        } catch (error) {
            console.error("Erro FavoriteController.update:", error);
            res.status(500).json({message: "Erro ao criar favorito", error});
        }
    },

    destroy: async (req: Request, res: Response) => {
        const {id} = req.params;
        if (!id) res.status(404).json({message: "Favorito não encontrado"});

        try {
            const favorite = await FavoriteModel.delete(id);
            if (!favorite) res.status(404).json({message: "Favorito não encontradi"});
            res.status(200).json({favorite});

        } catch (error) {
            console.error("Erro FavoriteController.destroy:", error);
            res.status(500).json({message: "Erro ao deletar favorito", error});
        }
    }
}

export default FavoriteController;