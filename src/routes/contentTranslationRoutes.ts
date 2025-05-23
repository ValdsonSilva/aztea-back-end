import ContentTranslationController from "../controllers/ContentTranslationController.js";
import { Router } from "express";

const contentTranslationRoutes = Router();

contentTranslationRoutes.get("/", ContentTranslationController.index);
contentTranslationRoutes.get("/:id", ContentTranslationController.show);
contentTranslationRoutes.get("/:contentId", ContentTranslationController.showByContentId);
contentTranslationRoutes.post("/", ContentTranslationController.store);
contentTranslationRoutes.put("/:id", ContentTranslationController.update);
contentTranslationRoutes.delete("/:id", ContentTranslationController.delete);

export default contentTranslationRoutes;