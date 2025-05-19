import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";

const router = Router();

router.get("/", CategoryController.index);
router.get("/:id", CategoryController.show);
router.post("/", CategoryController.store);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.destroy);

export default router;