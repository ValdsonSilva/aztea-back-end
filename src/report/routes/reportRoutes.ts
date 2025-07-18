import { Router } from "express";
import ReportController from "../controllers/ReportController.js";


const reportRoutes = Router();

reportRoutes.get("/", ReportController.index);
reportRoutes.get("/:id", ReportController.show);
reportRoutes.get("/user/:id", ReportController.showByUserId);
reportRoutes.post("/", ReportController.store);
reportRoutes.put("/:id", ReportController.update);
reportRoutes.delete("/:id", ReportController.destroy);
reportRoutes.post("/:id/resolve", ReportController.resolveReport);

export default reportRoutes;