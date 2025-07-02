import { Request, Response } from "express";
import { UserModel } from "../models/UserModel.js";
import cloudinary from "../config/cloudinary.js";
import { getMediaType } from "../services/getMediaType.js";
import { MediaModel } from "../models/MediaModel.js";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

interface IUserType {
    password: string;
    name: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    userType: string
}

const allowedUserTypes = ["admin", "developer", "founder", "reviewer", "artist"];

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

    show: async (req: Request, res: Response) => { 

        try {
            const user = await UserModel.findById(req.params.id);

            if (!user) res.status(404).json({ message: "Usuário não encontrado" });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Erro ao buscar usuário", error });
        }
    },

    store: async (req: Request, res: Response) => {

        const userData:IUserType = req.body;
        const avatarUrl = req.files as Express.Multer.File[];

        const data:IUserType = {
            name: userData.name,
            password: userData.password,
            email: userData.email,
            bio: userData.bio,
            userType: userData.userType
        }

            
        // Verifica se os campos obrigatórios estão presentes
        if (!data.email || !data.password || !data.name || !data.userType) {
            res.status(400).json({ message: "Email, senha, nome e o tipo de usuário são obrigatórios" });
        }

        try {

            const permissionCheck = data.userType && allowedUserTypes.includes(data.userType);

            if (!permissionCheck) res.status(400).json({message: "Tipo de usuário inexistente"});

            const user = await UserModel.create(data);

            if (avatarUrl && avatarUrl.length > 0) {
                console.log("Entrou em mídia");

                const safeName = data.name.replace(/\s+/g, '-').toLowerCase(); // tratando o nome do usuário

                await Promise.all(
                    avatarUrl.map(async (avatar) => {
                        try {
                            console.log("Processando:", avatar.originalname);
                            const type = getMediaType(avatar.mimetype);

                            const result = await cloudinary.uploader.upload(avatar.path, {
                                folder: `aztea/avatares/${safeName}/${type}`,
                                resource_type: type === 'video' ? 'video' : 'auto',
                            });

                            console.log("Arquivo enviado:", result.secure_url);

                            await prisma.user.update({
                                where: { id: user?.id },
                                data: { avatarUrl: result.secure_url },
                            });

                            fs.unlinkSync(avatar.path);

                        } catch (error) {
                            console.error(`Erro ao subir arquivo ${avatar.originalname}:`, error);
                        }
                    })
                );
            }


            res.status(201).json(user);

        } catch (error: unknown) {
            console.log("Erro no UserController.store", error)
            res.status(500).json({ message: "Erro ao criar usuário", error});
        }
    },

    // tem que atualizar este controller
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