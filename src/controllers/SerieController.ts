import { SerieModel } from "../models/SerieModel.js";
import { Request, Response } from "express";

const SerieController = {

    index: async (req: Request, res: Response) => {

        try {
            const series = await SerieModel.findAll();
            if (!series) res.status(404).json({message: "Series não encontradas"})
            res.status(200).json({series})
        } catch (error) {
            console.error("Erro no SerieController.index:", error);
            res.status(500).json({message: "Erro ao listar series", error});
        }
    },

    show: async (req: Request, res: Response) => {

        const {id} = req.params;

        if (!id) res.status(404).json({message: "Id não informado"});

        try {
            const serie = await SerieModel.findById(id);
            if (!serie) res.status(404).json({message: "Serie não encontrada"});
            res.status(200).json({serie})
        } catch (error) {
            console.error("Erro no SerieController.show:", error);
            res.status(500).json({message: "Erro ao listar serie", error});
        }   
    },

    store: async (req: Request, res: Response) => {

        const {title, userId} = req.body;

        const data = {
            title : title, 
            user: userId
        }

        if (!title || !userId) res.status(404).json({message: "Título ou Id do usuário não informado"})

        try {
            const serie = await SerieModel.create(data);
            if (!serie) res.status(404).json({message: "Serie não encontrada"})
            res.status(200).json({serie})
            
        } catch (error) {
            console.error("Erro no SerieController.store:", error);
            res.status(500).json({message: "Erro ao criar serie", error});
        }
    },

    update: async (req: Request, res: Response) => {

        const {id} = req.params;
        const {data} = req.body;

        if (!id) res.status(404).json({message: "Id não informado"});

        if (!data) res.status(404).json({message: "Obrigatório passar dados"});

        try {
            const serie = await SerieModel.update(id, data);
            if (!serie) res.status(404).json({message: "Serie não encontrada"});
            res.status(201).json({serie})
        } catch (error) {
            console.error("Erro SerieController.update:", error);
            res.status(500).json({message: "Erro ao atualizar a serie", error});
        }
    },

    delete: async (req: Request, res: Response) => {

        const {id} = req.params;
        if (!id) res.status(404).json({message: "Id não informado"});

        try {
            const serie = await SerieModel.delete(id);
            if (!serie) res.status(404).json({message: "Serie não encontrada"})
            res.status(200).json({serie});

        } catch (error) {
            console.error("Erro no SerieController.delete:", error);
            res.status(500).json({message: "Erro ao apagar serie", error});
        }
    }
}

export default SerieController;