import TagController from "../controllers/TagController.js";
import { Router } from "express";

const tagRoutes = Router();

tagRoutes.get("/", TagController.index);
tagRoutes.get("/:id", TagController.show);
tagRoutes.post("/", TagController.store);
tagRoutes.put("/:id", TagController.update);
tagRoutes.delete("/:id", TagController.destroy);

export default tagRoutes;