import { Request, Response } from "express";
import { UserModel } from "../models/UserModel.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

const UserController = {

    index: async (req: Request, res: Response) => {
        try {
            const users = await UserModel.findAll();

            if (!users) res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar usuários", error });
        }
    },

    show: async (req: Request, res: Response) =>{

        try {
            const user = await UserModel.findById(req.params.id);

            if (!user) res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar usuário", error });
        }
    },

    store: async (req: Request, res: Response) => {

        try {
            const { email, password, name, bio, avatarUrl, userType } = req.body;
            
            // Verifica se os campos obrigatórios estão presentes
            if (!email || !password || !name || !userType) {
                res.status(400).json({ message: "Email, senha, nome e o tipo de usuário são obrigatórios" });
            }

            const user = await UserModel.create({
                email,
                password,
                name,
                bio,
                avatarUrl,
                userType
            });

            res.status(201).json(user);

        } catch (error: unknown) {

            res.status(500).json({ message: "Erro ao criar usuário", error});
        }
    },

    update: async (req: Request, res: Response) => {

        const {id} = req.params;

        try {

            const foundUser = await UserModel.findById(id);

            if (!foundUser) res.status(404).json({message: "Usuário não encontrado"});

            const user = await UserModel.update(foundUser?.id, req.body);

            if (!user) res.status(400).json({ message: "Usuário não atualizado" });

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar usuário", error });
            
        }
    },

    destroy: async (req: Request, res: Response) => {

        const {id} = req.params;

        try {

            const foundUser = await UserModel.findById(id);

            if (!foundUser) res.status(404).json({message: "Usuário não encontrado"});

            const isAdmin = foundUser?.isAdmin ? true : false;

            // only admin's users can delete another user account automaticly
            if (!isAdmin) res.status(403).json({message: "Apenas admin pode deleter"});

            const user = await UserModel.delete(req.params.id);

            if (!user) res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar usuário", error });
        }
    },
}

export default UserController;