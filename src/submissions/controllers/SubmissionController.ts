import { Request, Response } from "express";
import { SubmissionModel } from "../models/SubmissionModel.js";
import { PrismaClient } from "@prisma/client";
import { MediaModel } from "../../media/models/MediaModel.js";
import cloudinary from "../../shared/config/cloudinary.js";
import { getMediaType } from "../../shared/services/getMediaType.js";
import fs from "fs";
import { isUserReviewerCheck } from "../../shared/services/isUserReviewerCheck.js";
import { UserModel } from "../../user/models/UserModel.js";

const prisma = new PrismaClient();

const SubmissionController = {
    // index
    index: async (req: Request, res: Response) => { 
        try {
            const submissions = await SubmissionModel.findAll();
            res.status(200).json(submissions);
        } catch (error) {
            console.log("Erro no SubmissionController.index", error);
            res.status(500).json({message: "Erro ao listar submissões", error});
        }
    },

    // show
    show: async (req: Request, res: Response) => {

        const {submissionId} = req.params;

        if (!submissionId) res.status(400).json({message: "Id da submissão não fornecido"});

        try {
            const submission = await SubmissionModel.findById(submissionId);

            res.status(200).json(submission);
        } catch (error) {
            console.log("Erro no SubmissionController.show");
            res.status(500).json({message: "Erro ao listar submissão", error});
        }
    },

    // create
    store: async (req: Request, res: Response) => {
        
        const data = req.body;
        const files = req.files as Express.Multer.File[];
            
        // Aqui você pode fazer validação mínima dos dados essenciais, exemplo:
        if (!data.title || !data.contentType || !data.categoryId || !data.userId) {
            res.status(400).json({ message: "Campos obrigatórios faltando" });
        }
        
        try {
        
            const foundUser = await SubmissionModel.findById(data.userId);

            if (!foundUser) res.status(404).json({message: "Usuário não encontrado"});

            // criando conteudo base
            const submission = await SubmissionModel.create({
                title: data.title,
                contentType: data.contentType,
                category: {
                    connect: {id: data.categoryId}
                },
                user: {
                    connect: {id: foundUser?.userId}
                },
                description: data.description,
            });

            if (files && files.length > 0) {
                console.log("Entrou em midia")
                for (const file of files) {
                    try {
                        console.log("processando", file.originalname)
                        const type = getMediaType(file.mimetype);

                        const result = await cloudinary.uploader.upload(file.path, {
                            folder: `aztea/conteudos/${type}`,
                            resource_type: type === 'video' ? 'video' : 'auto',
                        })

                        console.log("arquivos:", result);
                        
                        await MediaModel.create({
                            content: {
                                connect: {id: submission.id}
                            },
                            url: result.secure_url,
                            publicId: result.public_id,
                            type,
                        });

                        fs.unlinkSync(file.path);
                    } catch (error) {
                        console.log(`Erro ao subir arquivo ${file.originalname}`, error);
                    }

                };
            }
            
            // Conecta tags existentes
            if (data.tags) {
                const tags = JSON.parse(data.tags);
                if (Array.isArray(tags)) {
                    for (const tag of tags) {
                        let tagId: string;

                        if (tag.id) {
                            tagId = tag.id;

                        } else if (tag.name) {
                            const existingTag = await prisma.tag.findUnique({where: {name: tag.name}});

                            if (existingTag) {
                                tagId = existingTag.id;

                            } else {
                                const newTag = await prisma.tag.create({data: {name: tag.name}});
                                tagId = newTag.id;
                            }

                        } else {
                            continue;
                        }

                        await prisma.contentTag.create({
                            data: {
                                contentId: submission.id,
                                tagId,
                            }
                        });
                    }
                }
            }
        
            res.status(201).json(submission);
        
        } catch (error) {
            console.error("Erro no SubmissionController.store:", error);
            res.status(500).json({ message: "Erro ao criar submission", error });
        }
    },

    // approve a submission
    approve: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { reviewerId, feedback } = req.body;

        if (!id) res.status(400).json({message: "Id não informado"});

        if (!reviewerId) res.status(400).json({message: "Id do revisor não informado"});

        try {

            const foundUser = await prisma.user.findUnique({where: {id: reviewerId}});

            if (!foundUser) res.status(404).json({message: "Usuário não encontrado"})

            const isUserReviewer = isUserReviewerCheck(foundUser);

            if (!isUserReviewer) res.status(403).json({message:"Só revisores podem aprovar um conteúdo"});

            const submission = await prisma.submission.findUnique({
                where: { id },
                include: {
                    media: true,
                    tags: true,
                },
            });

            if (!submission) res.status(404).json({message: "Submissão não encontrada"});

            // Cria o novo conteúdo com base na submission
            const content = await prisma.content.create({
                data: {
                    title: submission?.title,
                    description: submission?.description,
                    thumbnailUrl: submission?.thumbnailUrl,
                    contentType: submission?.contentType,
                    categoryId: submission?.categoryId,
                    userId: submission?.userId,
                    seriesId: submission?.seriesId,
                    media: {
                        create: submission.media.map((m) => ({
                            url: m.url,
                            public_id: m.publicId,
                            type: m.type,
                        })),
                    },
                    tags: {
                        create: submission.tags.map((t) => ({
                            tagId: t.tagId,
                        })),
                    },
                },
            });

            // Atualiza a submission com status de aprovado
            await prisma.submission.update({
                where: { id },
                    data: {
                        status: "approved",
                        feedback,
                        reviewedAt: new Date(),
                        reviewerId,
                    },
            });

            res.status(201).json({ message: "Submission approvada", content });

        } catch (error) {
            console.error("Erro no SubmissionControler.approve:", error);
            res.status(500).json({ message: "Erro interno ao aprovar submission", error});
        }
    },

    showByPending: async (req: Request, res: Response) => {
        try {
            const pendingSubmissions = await SubmissionModel.findByPending();

            if (!pendingSubmissions) res.status(404).json({message: "Não há submissões pendentes"});

            res.status(200).json(pendingSubmissions);
        } catch (error) {
            console.log("Erro no SubmissionControler.indexByPending", error);
            res.status(500).json({message: "Erro ao listar submissões pendentes", error});
        }
    },

    showByUserId: async (req: Request, res: Response) => {

        const {id} = req.params;

        if (!id) res.status(400).json({message: "Id não informado"});

        try {
            const foundSubmission = await SubmissionModel.finByUserId(id);

            if (!foundSubmission) res.status(404).json({message: "Usuário não encontrado"});

            res.status(200).json(foundSubmission);
        } catch (error) {
            console.log("Erro no SubmissionController.showByUserId", error);
            res.status(500).json({message: "Erro ao listar submissão do usuário", error});
        }
    },

    reject: async (req: Request, res: Response) => {
        const { id } = req.params;
        const { reviewerId, feedback } = req.body;

        if (!id) res.status(400).json({message: "Id não informado"});

        if (!reviewerId) res.status(400).json({message: "Id do revisor não informado"});

        try {
            const foundUser = await UserModel.findById(reviewerId);
            const isReviewerUser = isUserReviewerCheck(foundUser);

            if (!isReviewerUser) res.status(403).json({message: "Só revisores podem rejeitar um conteúdo"});

            const submission = await prisma.submission.findUnique({ where: { id } });

            if (!submission) res.status(404).json({ message: "Submissão não encontrada" });

            if (submission.status !== "pending") res.status(400).json({ message: "Apenas submissões pendentes podem ser rejeitadas" });


            const updated = await prisma.submission.update({
                where: { id : submission.id },
                data: {
                    status: "rejected",
                    feedback,
                    reviewedAt: new Date(),
                    reviewerId,
                },
            });

            res.status(200).json({ message: "Submissão rejeitada", submission: updated });

        } catch (error) {
            console.error("Erro no SubmissionController.reject:", error);
            res.status(500).json({ message: "Erro ao rejeitar submissão" });
        }
    }

};

export default SubmissionController;