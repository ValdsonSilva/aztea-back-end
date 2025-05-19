import { Request, Response } from "express";
import { UserModel } from "../models/UserModel.js";


const UserController = {

    index: async (req: Request, res: Response) => {
        try {
            const users = await UserModel.findAll();

            if (!users) return res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar usuários", error });
        }
    },

    show: async (req: Request, res: Response) =>{

        try {
            const user = await UserModel.findById(req.params.id);

            if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar usuário", error });
        }
    },

    store: async (req: Request, res: Response) => {

        try {
            const { email, password, name, bio, avatarUrl } = req.body;
            
            // Verifica se os campos obrigatórios estão presentes
            if (!email || !password || !name) {
                return res.status(400).json({ message: "Email, senha e nome são obrigatórios" });
            }

            const user = await UserModel.create({
                email,
                password,
                name,
                bio,
                avatarUrl
            });

            res.status(201).json(user);

        } catch (error: unknown) {

            console.error("Erro ao criar usuário OPA:", error);
            res.status(500).json({ message: "Erro ao criar usuário", error});
        }
    },

    update: async (req: Request, res: Response) => {

        try {
            const user = await UserModel.update(req.params.id, req.body);

            if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar usuário", error });
            
        }
    },

    destroy: async (req: Request, res: Response) => {
        try {
            const user = await UserModel.delete(req.params.id);

            if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar usuário", error });
        }
    },
}

export default UserController;