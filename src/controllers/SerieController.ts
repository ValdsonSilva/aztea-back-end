import { Prisma, PrismaClient } from "@prisma/client";
import { ContentModel } from "../models/ContentModel.js";
import { SerieModel } from "../models/SerieModel.js";
import { Request, Response } from "express";

interface ISerieStore {
    title: string,
    userId: string,
}

const prisma = new PrismaClient();

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
        const { title, userId, contentIds } = req.body;

        if (!title || !userId) res.status(400).json({ message: "Título ou ID do usuário não informado" });

        const data: ISerieStore = {
            title,
            userId
        }

        try {
            const serie = await SerieModel.create(data);

            if (!serie) res.status(500).json({ message: "Erro ao criar série" });
            

            // Se vierem conteúdos, associe à série
            if (Array.isArray(contentIds) && contentIds.length > 0) {
                await Promise.all(
                    contentIds.map((contentId) =>
                        prisma.content.update({
                            where: { id: contentId },
                            data: { seriesId: serie.id },
                        })
                    )
                );
            }

            const contents = await prisma.content.findMany({
                where: { seriesId: serie.id },
            });

            res.status(201).json({ serie, contents });

        } catch (error) {
            console.error("Erro no SerieController.store:", error);
            res.status(500).json({ message: "Erro ao criar série", error });
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

    destroy: async (req: Request, res: Response) => {

        const {id} = req.params;
        if (!id) res.status(404).json({message: "Id não informado"});

        try {
            const serie = await SerieModel.delete(id);
            if (!serie) res.status(404).json({message: "Serie não encontrada"})
            res.status(200).json({serie});

        } catch (error) {
            console.error("Erro no SerieController.destroy:", error);
            res.status(500).json({message: "Erro ao apagar serie", error});
        }
    }
}

export default SerieController;

// {
// 	"id": "6b0c3ba0-ff5b-4973-a2f6-2538b99993e1",
// 	"title": "English title 02",
// 	"description": "I love to sing",
// 	"thumbnailUrl": null,
// 	"contentType": "image",
// 	"published": false,
// 	"scheduledAt": null,
// 	"categoryId": "840d2b8e-649a-4b1f-9399-3177ffdb14cf",
// 	"userId": "43d2ef09-b976-48c1-ad85-c6892cd512a1",
// 	"seriesId": null,
// 	"views": 0,
// 	"votes": 0,
// 	"createdAt": "2025-06-03T18:17:00.507Z",
// 	"updatedAt": "2025-06-03T18:17:00.507Z",
// 	"category": {
// 		"id": "840d2b8e-649a-4b1f-9399-3177ffdb14cf",
// 		"name": "Pop"
// 	},
// 	"user": {
// 		"id": "43d2ef09-b976-48c1-ad85-c6892cd512a1",
// 		"email": "valdsonmacedo15@gmail.com",
// 		"password": "11122002",
// 		"name": "Valdson Silva",
// 		"bio": "Sou um jovem católico de 22 anos apaixonada por música católica. Sou ministro de música e toco violão.",
// 		"avatarUrl": null,
// 		"isAdmin": false,
// 		"createdAt": "2025-05-10T18:32:06.175Z"
// 	},
// 	"series": null,
// 	"media": [],
// 	"tags": [],
// 	"comments": [],
// 	"favorites": [],
// 	"translations": []
// }