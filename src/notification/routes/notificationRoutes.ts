import NotificationController from "../controllers/NotificationController.js";
import { Router } from "express";

const notificationRoutes = Router();

notificationRoutes.get('/', NotificationController.index);
notificationRoutes.get('/:id', NotificationController.show);
notificationRoutes.post('/', NotificationController.store);
notificationRoutes.put('/:id', NotificationController.update);
notificationRoutes.delete('/:id', NotificationController.destroy);

export default notificationRoutes;