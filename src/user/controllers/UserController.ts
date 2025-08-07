import { Request, Response } from "express";
import { UserModel } from "../models/UserModel.js";
import allowedUserTypes from "../../shared/utils/allowedUserTypes.js";
import { uploadFiles } from "../../shared/services/UploadFiles.js";
import { userServices } from "../services/userServices.js";
import { User } from "@prisma/client";

export interface IUserType {
    password: string;
    name: string;
    email: string;
    bio?: string;
    avatarUrl?: string | Express.Multer.File[];
    userType: string;
    city: string
    state: string;
    region: string;
    country: string;
    termsAcceptedAt: Date;
    privacyAcceptedAt: Date;
    termsVersionAccepted: string
}

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

        const userData: User = req.body;
        const avatarUrl = req.files as Express.Multer.File[];

        const data: User = {
            name: userData.name,
            password: userData.password,
            email: userData.email,
            termsAcceptedAt: userData.termsAcceptedAt,
            birthDate: userData.birthDate,
            privacyAcceptedAt: userData.privacyAcceptedAt,
            city: userData.city,
            state: userData.state,
            region: userData.region,
            country: userData.country,
        }

        try {

            const user = await userServices.createUser(data)

            await uploadFiles({user, data, avatarUrl});

            res.status(201).json(user);

        } catch (error: unknown) {
            console.log("Erro no UserController.store", error)
            res.status(500).json({ message: "Erro ao criar usuário", error});
        }
    },

    // tem que atualizar este controller
    update: async (req: Request, res: Response) => {

        const {id} = req.params;
        const userData: IUserType = req.body;
        const avatarUrl = req.files as Express.Multer.File[];

        try {

            const foundUser = await UserModel.findById(id);

            if (!foundUser) res.status(404).json({message: "Usuário não encontrado"});

            const data = {
                foundUser,
                avatarUrl
            }

            await userServices.updateAvatar(data);

            const user = await userServices.updateUser(id, userData)

            if (!user) res.status(400).json({ message: "Usuário não atualizado" });

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao atualizar usuário", error });
            
        }
    },

    destroy: async (req: Request, res: Response) => {

        const {id, destroyedBy} = req.params;

        try {

            const user = await userServices.deleteUser(destroyedBy, id);

            res.status(200).json(user);

        } catch (error) {
            res.status(500).json({ message: "Erro ao deletar usuário", error });
        }
    },
}

export default UserController;