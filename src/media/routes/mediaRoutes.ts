import { Router } from "express";
import MediaController from "../controllers/MediaController.js";

const mediaRoutes = Router();

mediaRoutes.get("/", MediaController.index);
mediaRoutes.get("/:id", MediaController.show);
mediaRoutes.post("/", MediaController.store);
mediaRoutes.put("/:id", MediaController.update);
mediaRoutes.delete("/:id", MediaController.destroy);

export default mediaRoutes;