import { PrismaClient } from "@prisma/client";
import { MediaModel } from "../models/MediaModel.js";
import { Request, Response } from "express";
import cloudinary from "../../shared/config/cloudinary.js";

const prisma = new PrismaClient();

const MediaController = {
    
    index: async (req: Request, res: Response) => {
        try {
            const medias = await prisma.media.findMany();
                    
            res.status(200).json(medias);
        } catch (error) {
            console.log("Erro no MediaController.index:", error);
            res.status(500).json({message: "Erro ao criar uma midia", error});
        }
    },

    show: async (req: Request, res: Response) => {
        const {id} = req.params;

        if (!id) res.status(404).json({message: "Id não fornecido"});

        try {
            const media = await prisma.media.findUnique({where: {id: id}});

            if (!media) res.status(404).json({message: "Mida não encontrada"});

            res.status(200).json(media);
        } catch (error) {
            console.log("Erro no MediaController.show:", error);
            res.status(500).json({message: "Erro ao buscar midia", error});
        }
    },

    store: async (req: Request, res: Response) => {

        const data = req.body;

        if (!data) res.status(404).json({message: "Dados não fornecidos"});

        try {
            const media = await prisma.media.create(data);
            if (!media) res.status(404).json({message: "Erro ao criar media"});
            res.status(200).json(media);
        } catch (error) {
            console.log("Erro no MediaController.store:", error);
            res.status(500).json({message: "Erro ao criar midia", error});
        }
    },

    update: async (req:Request, res: Response) => {

        const {id} = req.params;
        const data = req.body;

        if (!id && !data) res.status(404).json({message: "Dados não fornecidos"});

        try {
            const media = await prisma.media.update({where: {id: id}, data});
            if (!media) res.status(404).json({message: "Midia não encontrada"});
            res.status(201).json(media);
        } catch (error) {
            console.log("Erro no MediaController.update:", error);
            res.status(500).json({message: "Erro ao atualizar midia", error});
        }
    },

    destroy: async (req: Request, res: Response) => {
        const {id} = req.params;
        const mediaToRemove = await prisma.media.findUnique({
            where: {id}
        })

        if (!id) res.status(404).json({message: "Id não fornecido"});
        if (!mediaToRemove) res.status(404).json({message: "Midia não encontrada"})

        try {
            // deletando no cloudinary
            const deleteOnCloudinary = await cloudinary.uploader.destroy(mediaToRemove?.publicId);
            // deletando no banco
            const deleteTheFoundMedia = await prisma.media.deleteMany({
                where: {
                    id,
                    publicId: mediaToRemove?.publicId
                }
            });

            if (!deleteTheFoundMedia || !deleteOnCloudinary) res.status(404).json({message: "Midia não encontrada"});

            res.status(200).json(deleteTheFoundMedia);
        } catch (error) {
            console.log("Erro no MediaController.destroy:", error);
            res.status(500).json({message: "Erro ao deleter midia", error});
        }
    }
}

export default MediaController;