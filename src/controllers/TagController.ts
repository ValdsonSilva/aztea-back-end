import { TagModel } from "../models/TagModel.js";
import { Request, Response } from "express";


const TagController = {
    // index
    index: async (req: Request, res: Response) => {
        try {
            const tags = await TagModel.findAll();

            if (!tags) res.status(404).json({message: "Tags não encontradas"});

            res.status(200).json(tags);

        } catch (error) {
            console.error("Erro no TagController.index:", error);
            res.status(500).json({message: "Erro ao listar categorias", error});
        }
    },
    // show
    show: async (req: Request, res: Response) => {
        const {id} = req.params;

        if (!id) res.status(400).json({message: "ID não informado"});

        try {
            const tag = await TagModel.findById(id);
            
            if (!tag) res.status(404).json({message: "Tag não encontrada"});

            res.status(200).json(tag)

        } catch (error) {
            console.error("Erro no TagController.show:", error);
            res.status(500).json({message: "Erro ao buscar tag:", error})
        }
    },
    // store 
    store: async (req: Request, res: Response) => {
        const {name} = req.body;

        if (!name) res.status(400).json({message: "Nome da tag não informado"});

        try {
            const tag = await TagModel.create(name);
            
            if (!tag) res.status(404).json({message: "Tag não encontrada"});

            res.status(201).json(tag);
        } catch (error) {
            console.error("Erro no TagController.store:", error);
            res.status(500).json({message: "Erro ao criar a tag", error});
        }
    },
    // update
    update: async (req: Request, res: Response) => {
        const {id} = req.params;
        const {name} = req.body;

        if (!id || !name) res.status(400).json({message: "ID ou nome da tag não informado"});

        try {
            const tag = await TagModel.update(id, name);

            if (!tag) res.status(404).json({message: "Tag não encontrada"})
            
            res.status(200).json(tag)
        } catch (error) {
            console.error("Erro no TagController.update:", error);
            res.status(500).json({message: "Erro ao atualizar tag", error});
        }
    },
    // delete
    delete: async (req: Request, res: Response) => {
        const {id} = req.params;

        if (!id) res.status(404).json({message: "ID não informado"});

        try {
            const tag = await TagModel.delete(id);

            if (!tag) res.status(404).json({message: "Tag não encontrada"});

            res.status(200).json(tag)
        } catch (error) {
            console.error("Erro no TagController.delete:", error);
            res.status(500).json({message: "Erro ao deleter a tag", error});
        }
    }
}

export default TagController;