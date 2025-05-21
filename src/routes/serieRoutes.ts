import { Router } from "express";
import SerieController from "../controllers/SerieController.js";

const serieRoutes = Router();

serieRoutes.get('/', SerieController.index);
serieRoutes.get('/:id', SerieController.show);
serieRoutes.post('/', SerieController.store);
serieRoutes.put('/:id', SerieController.update);
serieRoutes.delete('/:id', SerieController.delete);

export default serieRoutes;