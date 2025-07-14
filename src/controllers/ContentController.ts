import { Request, Response } from "express";
import { ContentModel } from "../models/ContentModel.js";
import { MediaModel } from "../models/MediaModel.js"
import fs from "fs";
import { ContentTranslationModel } from "../models/ContentTranslationModel.js";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary.js";
import { TagModel } from "../models/TagModel.js";
import { getMediaType } from "../services/getMediaType.js";
import { UserModel } from "../models/UserModel.js";
import { contentService, ICreateContentDTO } from "../services/content/contentService.js";

const prisma = new PrismaClient();

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
        contentId: req.query.contentId as string | undefined,
        tagName: req.params.tagName as string | undefined,
      };

      if (!filters) res.status(400).json({ message: "Filtros inválidos" });

      const contents = await ContentModel.findAll(filters);
      res.status(200).json({contents, count: contents.length});

    } catch (error) {
      console.error("Erro no ContentController.index:", error);
      res.status(500).json({ message: "Erro ao listar conteúdos", error });
    }
  },

  show: async (req: Request, res: Response) => {
    try {
      const content = await ContentModel.findById(req.params.id);
      if (!content) res.status(404).json({ message: "Conteúdo não encontrado" });
      res.status(200).json(content);

    } catch (error) {
      console.error("Erro no ContentController.show:", error);
      res.status(500).json({ message: "Erro ao buscar conteúdo", error });
    }
  },

  store: async (req: Request, res: Response) => {
    
    const {userId} = req.body;
    const bodyData:ICreateContentDTO = req.body;
    const files = req.files as Express.Multer.File[];

    if (!userId) res.status(404).json({message: "Id do usuário não informado"});

    // Aqui você pode fazer validação mínima dos dados essenciais, exemplo:
    if (!bodyData.title || !bodyData.contentType || !bodyData.categoryId || !bodyData.userId) {
      res.status(400).json({ message: "Campos obrigatórios faltando" });
    }

    const data: ICreateContentDTO = {
      userId: bodyData.userId,
      title: bodyData.title,
      description: bodyData.description,
      contentType: bodyData.contentType,
      categoryId: bodyData.categoryId,
      translations: bodyData.translations,
      tags: bodyData.tags,
      files: files
    };

    try {

      const foundUser = await UserModel.findById(userId);

      if (!foundUser) res.status(404).json({message: "Usuário não encontrado"});

      const isAdmin = foundUser?.isAdmin ? true : false

      if (!isAdmin) res.status(403).json({message: "Só administradores podem postar um conteúdo"});

      // criando conteudo base
      const content = await contentService.createContent(data)

      res.status(201).json(content);

    } catch (error) {
      console.error("Erro no ContentController.store:", error);
      res.status(500).json({ message: "Erro ao criar conteúdo", error });
    }
  },

  update: async (req: Request, res: Response) => {

    console.log("body:", req.body)

    try {
      const contentId = req.params.id;
      const data = req.body;
      const files = req.files as Express.Multer.File[];

      // verifica se o conteúdo existe
      const existingContent = await prisma.content.findUnique({where: {id: contentId}});

      if (!existingContent) res.status(404).json({message: "Conteúdo não encontrado"});

      if (!data) res.status(400).json({message: "É obrigatório passar dados para atualizar"});

      // atualizando conteúdo (campos principais)
      const updateContent = await ContentModel.update(contentId, {
        title: data.title,
        description: data.description,
      });

      // 2. REMOVE mídias informadas (via public_id)
      if (data.removeMedia) {
        const toRemove: String[] = JSON.parse(data.removeMedia);

        for (const publicId in toRemove) {
          try {
              // removendo a midia do cloudinary
              await cloudinary.uploader.destroy(publicId);

              // remove do banco
              await prisma.media.deleteMany({
                where: {
                  contentId,
                  publicId
                }
              });
          } catch (error) {
            console.log(`Erro ao apagar no cloudinary a midia de id ${publicId}:`, error)
          }
        };
      }

      // 3. ADICIONA novas mídias (se arquivos foram enviados)
      if (files && files.length > 0) {
        console.log("Entrou em midia")
        for (const file of files) {
              try {
                  console.log("processando", file.originalname)
                  const type = getMediaType(file.mimetype);

                  const result = await cloudinary.uploader.upload(file.path,{
                    folder: `aztea/conteudos/${type}`,
                    resource_type: type === 'video' ? 'video' : 'auto',
                  })

                  console.log("arquivos:", result);
                  
                  await MediaModel.create({
                    content: {
                      connect: {id: contentId}
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

      // atualiza traduções 
      if (data.translations) {
        const translations = JSON.parse(data.translations);

        if (Array.isArray(translations)) {
          try {
            // Remove todas as traduções anteriores do conteúdo
            await prisma.contentTranslation.deleteMany({
              where: { contentId },
            });

            // Cria as novas traduções
            await prisma.contentTranslation.createMany({
              data: translations.map((t: any) => ({
                contentId,
                language: t.language,
                title: t.title,
                description: t.description,
              })),
            });

          } catch (error) {
            console.error("Erro ao atualizar traduções:", error);
          }
        }
      }

      // 4. Atualiza tags (remove todas e recria com base em id ou nome)
      if (data.tags) {
      const tags = JSON.parse(data.tags);

      if (Array.isArray(tags)) {
        // Remove as associações antigas
        await prisma.contentTag.deleteMany({
          where: { contentId },
        });

        // Reconecta/cria tags novas
        for (const tag of tags) {
          let tagId: string;

          if (tag.id) {
            tagId = tag.id;
          } else if (tag.name) {
            const existingTag = await prisma.tag.findUnique({ where: { name: tag.name } });

            if (existingTag) {
              tagId = existingTag.id;
            } else {
              const newTag = await prisma.tag.create({ data: { name: tag.name } });
              tagId = newTag.id;
            }
          } else {
            continue;
          }

          await prisma.contentTag.create({
            data: {
              contentId,
              tagId,
            },
          });
        }
      }
      }

      res.status(200).json(updateContent);

    } catch (error) {
      console.error("Erro no ContentController.update:", error);
      res.status(500).json({ message: "Erro ao atualizar conteúdo", error });
    }
  },

  destroy: async (req: Request, res: Response) => {

    const contentId = req.params?.id;
    const tagIds: [] = req.body?.tagId;
    const mediaIds: [] = req.body?.mediaId;
    const translationIds: [] = req.body?.translation;

    if (!contentId) res.status(404).json({message: "Id não informado"})

    const existingContent = await prisma.content.findUnique({where: {id: contentId}});

    if (!existingContent) res.status(404).json({message: "Conteúdo não encontrado"});

    try {
      // Remove vínculos na pivot table contentTag (importante!)
      await prisma.contentTag.deleteMany({
        where: {
          contentId,
        },
      });

      await prisma.contentTranslation.deleteMany({
        where: {
          contentId,
        }
      })

      // pode vir um array de tags
      if (tagIds) {
        for (const tag of tagIds) {
          await TagModel.delete(tag);
        }
      }

      // pode vir um array de medias
      if (mediaIds) {
        for (const media of mediaIds) {
          await MediaModel.delete(media);
        }
      }

      const content = await ContentModel.delete(contentId);
      const contents = await ContentModel.findAll()

      if (!content) res.status(404).json({ message: "Conteúdo não encontrado"});
      res.status(200).json({content, count: contents.length});

    } catch (error) {
      console.error("Erro no ContentController.destroy:", error);
      res.status(500).json({ message: "Erro ao deletar conteúdo", error });
    }
  },

  incrementViews: async (req: Request, res: Response) => {
    try {
      const content = await ContentModel.incrementViews(req.params.id);
      if (!content) res.status(404).json({ message: "Conteúdo não encontrado" });
      res.status(200).json(content);
    } catch (error) {
      console.error("Erro no ContentController.incrementViews:", error);
      res.status(500).json({ message: "Erro ao incrementar views", error });
    }
  },

  incrementVotes: async (req: Request, res: Response) => {
    try {
      const content = await ContentModel.incrementVotes(req.params.id);
      if (!content) res.status(404).json({ message: "Conteúdo não encontrado" });
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
