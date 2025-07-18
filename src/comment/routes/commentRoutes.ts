import CommentController from "../controllers/CommentController.js";
import { Router } from "express";

const commentRoutes = Router();

commentRoutes.get('/', CommentController.index);
commentRoutes.get('/:id', CommentController.show);
commentRoutes.get('/content/:contentId', CommentController.showByContentId);
commentRoutes.get('/user/:userId', CommentController.showByUserId);     
commentRoutes.post('/', CommentController.store);
commentRoutes.put('/:id', CommentController.update);
commentRoutes.delete('/:id', CommentController.destroy);

export default commentRoutes;