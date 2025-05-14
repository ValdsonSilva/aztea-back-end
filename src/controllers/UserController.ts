import { Request, Response } from "express";
import { UserModel } from "../models/UserModel";


export class UserController {

    static async index(req: Request, res: Response) {
        try {
            const users = await UserModel.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar usuários", error });
        }
    }

    static async show(req: Request, res: Response) {

        try {
            const user = await UserModel.findById(req.params.id);

            if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar usuário", error });
        }
    }

    static async store(req: Request, res: Response) {

        try {
            const { email, password, name, bio, avatarUrl } = req.body;

            const user = await UserModel.create({
                email,
                password,
                name,
                bio,
                avatarUrl
            });

            res.status(201).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao criar usuário", error });
        }
    }

    static async update(req: Request, res: Response) {

        try {
            const user = await UserModel.update(req.params.id, req.body);

            if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar usuário", error });
            
        }
    }

    static async destroy(req: Request, res: Response) {
        try {
            const user = await UserModel.delete(req.params.id);

            if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar usuário", error });
        }
    }
}