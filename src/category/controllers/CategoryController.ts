import { Request, Response } from "express";
import { CategoryModel } from "../models/CategoryModel.js";
import { categoryServices } from "../services/categoryService.js";

const CategoryController = {
    // Aqui você pode adicionar métodos para manipular categorias
    index: async (req: Request, res: Response) => {
        try {
            const categories = await CategoryModel.findAll();
            if (!categories) return res.status(404).json({ message: "Nenhuma categoria encontrada" });
            res.status(200).json(categories);
        } catch (error) {
            console.error("Erro no CategoryController.index:", error);
            res.status(500).json({ message: "Erro ao listar categorias", error });
            
        }
    },

    show: async (req: Request, res: Response) => {

        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "ID não informado" });
        }

        try {
            const category = await CategoryModel.findById(id)
            if (!category) return res.status(404).json({ message: "Categoria não encontrada" });
            res.status(200).json(category);
        } catch (error) {
            console.error("Erro no CategoryController.show:", error);
            res.status(500).json({ message: "Erro ao buscar categoria", error });
        }
    },

    store: async (req: Request, res: Response) => {
        const { name } = req.body;

        try {
            const category = await categoryServices.store(name);
            console.log(category)
            res.status(200).json(category);
        } catch (error) {
            console.error("Erro no CategoryController.store:", error);
            res.status(500).json({ message: "Erro ao criar categoria", error });
            
        }
    },

    update: async (req: Request, res: Response) => {
        const {id} = req.params;
        const { name, isPublic } = req.body

        if (!id) res.status(400).json({message: "Id não informado"})

        if (!name && isPublic === null) {
            res.status(400).json({ message: "Nenhum dado enviado" });
        }

        const data = {
            name,
            isPublic
        }

        try {
            const category = await CategoryModel.update(id, data);
            if (!category) return res.status(404).json({ message: "Categoria não encontrada" });
            res.status(200).json(category);
        } catch (error) {
            console.error("Erro no CategoryController.update:", error);
            res.status(500).json({ message: "Erro ao atualizar categoria", error });
            
        }
    },

    destroy: async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ message: "ID não informado" });
        }

        try {
            const category = await CategoryModel.delete(id);
            if (!category) return res.status(404).json({ message: "Categoria não encontrada" });
            res.status(200).json(category);
        } catch (error) {
            console.error("Erro no CategoryController.destroy:", error);
            res.status(500).json({ message: "Erro ao deletar categoria", error });
            
        }
    }
}

export default CategoryController;