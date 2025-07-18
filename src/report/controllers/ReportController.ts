import { Request, Response } from "express";
import { ReportModel } from "../models/ReportModels.js";
import { reportService } from "../services/reportService.js";


const ReportController = {
    // index
    index: async (req: Request, res: Response) => {
        try {
            const reports = await ReportModel.findAll();

            if (!reports) res.status(404).json({message: "Denúncias não encontradas"});

            res.status(200).json({reports});
        } catch (error) {
            console.log("Erro no ReportController.index:", error);
            res.status(500).json({message: "Erro ao listar denúncias"});
        }
    },
    // show
    show: async (req: Request, res: Response) => {
        const {id} = req.params;    

        try {
            const report = await ReportModel.findById(id);

            if (!report) res.status(404).json({message: "Denúncia não encontrada"});

            res.status(200).json({report});
        } catch (error) {
            console.log("Erro no ReportController.show:", error);
            res.status(500).json({message: "Erro ao buscar denúncia"});
        }
    },

    showByUserId: async (req: Request, res: Response) => {
        const {id} = req.params;

        try {
            const report = await ReportModel.findByUserId(id);

            if (!report) res.status(404).json({message: "Denúncia não encontrada"});

            res.status(200).json({report});
        } catch (error) {
            console.log("Erro no ReportController.showByUserId:", error);
            res.status(500).json({message: "Erro ao buscar denúncia"});
        }
    },
    // store
    store: async (req: Request, res: Response) => {
        try {
            const report = await reportService.createReport(req.body);

            if (!report) res.status(400).json({message: "Erro ao criar denúncia"});

            res.status(201).json({report});
        } catch (error) {
            console.log("Erro no ReportController.store:", error);
            res.status(500).json({message: "Erro ao criar denúncia"});
        }
    },
    // update
    update: async (req: Request, res: Response) => {
        const {id} = req.params;
        const data = req.body;

        try {
            const report = await reportService.updateReport(id, data);

            if (!report) res.status(404).json({message: "Denúncia não encontrada"});

            res.status(200).json({report});
        } catch (error) {
            console.log("Erro no ReportController.update:", error);
            res.status(500).json({message: "Erro ao atualizar denúncia"});
        }
    },
    // resolveReport
    resolveReport: async (req: Request, res: Response) => {
        const {id} = req.params;
        const { moderatorId } = req.params;

        try {
            const report = await reportService.resolveReport(id, moderatorId);

            if (!report) res.status(404).json({message: "Denúncia não encontrada"});

            res.status(200).json({report, message: "Denúncia resolvida!"});
        } catch (error) {
            console.log("Erro no ReportController.resolveReport:", error);
            res.status(500).json({message: "Erro ao resolver denúncia"});
        }
    },
    // destroy
    destroy: async (req: Request, res: Response) => {
        const {id} = req.params;

        try {
            const report = await reportService.deleteReport(id);

            if (!report) res.status(404).json({message: "Denúncia não encontrada"});

            res.status(200).json({message: "Denúncia excluída com sucesso"});
        } catch (error) {
            console.log("Erro no ReportController.destroy:", error);
            res.status(500).json({message: "Erro ao excluir denúncia"});
        }
    },
};

export default ReportController;