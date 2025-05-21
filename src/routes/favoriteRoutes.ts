import { Router } from "express";
import FavoriteController from "../controllers/FavoriteController.js";

const favoriteRoutes = Router();

favoriteRoutes.get('/', FavoriteController.index);
favoriteRoutes.get('/:id', FavoriteController.show);
favoriteRoutes.post('/', FavoriteController.store);
favoriteRoutes.put('/:id', FavoriteController.update);
favoriteRoutes.delete('/:id', FavoriteController.delete);

export default favoriteRoutes;