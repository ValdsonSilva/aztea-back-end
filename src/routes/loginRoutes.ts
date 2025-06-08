import { Router } from "express";
import { login } from "../controllers/AuthController.js";

const loginRoutes = Router();

loginRoutes.post('/login', login);

export default loginRoutes;

