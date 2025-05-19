import { Request, Response } from "express";
import { ContentModel } from "../models/ContentModel.js";

const ContentController = {

  index: async (req: Request, res: Response) => {
    try {
      // Opcional: você pode receber filtros pela query params
      const filters = {
        categoryId: req.query.categoryId as string | undefined,
        userId: req.query.userId as string | undefined,
        published: req.query.published ? req.query.published === "true" : undefined,
        skip: req.query.skip ? Number(req.query.skip) : undefined,
        take: req.query.take ? Number(req.query.take) : undefined,
      };

      if (!filters) res.status(400).json({ message: "Filtros inválidos" });

      const contents = await ContentModel.findAll(filters);
      res.status(200).json(contents);

    } catch (error) {
      console.error("Erro no ContentController.index:", error);
      res.status(500).json({ message: "Erro ao listar conteúdos", error });
    }
  },

  show: async (req: Request, res: Response) => {
    try {
      const content = await ContentModel.findById(req.params.id);
      if (!content) return res.status(404).json({ message: "Conteúdo não encontrado" });
      res.status(200).json(content);

    } catch (error) {
      console.error("Erro no ContentController.show:", error);
      res.status(500).json({ message: "Erro ao buscar conteúdo", error });
    }
  },

  store: async (req: Request, res: Response) => {
    try {
      const data = req.body;

      // Aqui você pode fazer validação mínima dos dados essenciais, exemplo:
      if (!data.title || !data.contentType || !data.categoryId || !data.userId) {
        return res.status(400).json({ message: "Campos obrigatórios faltando" });
      }

      const content = await ContentModel.create(data);
      res.status(201).json(content);

    } catch (error) {
      console.error("Erro no ContentController.store:", error);
      res.status(500).json({ message: "Erro ao criar conteúdo", error });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const content = await ContentModel.update(req.params.id, req.body);
      if (!content) return res.status(404).json({ message: "Conteúdo não encontrado" });
      res.status(200).json(content);

    } catch (error) {
      console.error("Erro no ContentController.update:", error);
      res.status(500).json({ message: "Erro ao atualizar conteúdo", error });
    }
  },

  destroy: async (req: Request, res: Response) => {
    try {
      const content = await ContentModel.delete(req.params.id);
      if (!content) return res.status(404).json({ message: "Conteúdo não encontrado" });
      res.status(200).json(content);

    } catch (error) {
      console.error("Erro no ContentController.destroy:", error);
      res.status(500).json({ message: "Erro ao deletar conteúdo", error });
    }
  },

  incrementViews: async (req: Request, res: Response) => {
    try {
      const content = await ContentModel.incrementViews(req.params.id);
      if (!content) return res.status(404).json({ message: "Conteúdo não encontrado" });
      res.status(200).json(content);
    } catch (error) {
      console.error("Erro no ContentController.incrementViews:", error);
      res.status(500).json({ message: "Erro ao incrementar views", error });
    }
  },

  incrementVotes: async (req: Request, res: Response) => {
    try {
      const content = await ContentModel.incrementVotes(req.params.id);
      if (!content) return res.status(404).json({ message: "Conteúdo não encontrado" });
      res.status(200).json(content);
    } catch (error) {
      console.error("Erro no ContentController.incrementVotes:", error);
      res.status(500).json({ message: "Erro ao incrementar votes", error });
    }
  },

  findContentByTag: async (req: Request, res: Response) => {
    try {
        const tagName = req.params.tagName;
        if (!tagName) res.status(400).json({message: "Tag inválida"});

        const contents = await ContentModel.findByTag(tagName);

        if (contents.length === 0) res.status(404).json({message: "Nenhum conteúdo encontrado com essa tag"});

        res.status(200).json(contents);

    } catch (error) {
        console.error("Erro no ContentController.findContentByTag:", error);
        res.status(500).json({ message: "Erro ao buscar conteúdo por tag", error });
    }
  }

};

export default ContentController;
