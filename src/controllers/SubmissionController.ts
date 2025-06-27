import { Request, Response } from "express";
import { SubmissionModel } from "../models/SubmissionModel";

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
    create: async (req: Request, res: Response) => {

    }
    // update
    // delete
};

export default SubmissionController;