import {Router} from "express";
import UserController from "../controllers/UserController.js";

// routes/userRoutes.ts
const userRoutes = Router();

// GET /users - Lista todos os usuários
userRoutes.get('/', UserController.index);

// GET /users/:id - Busca usuário por ID
userRoutes.get('/:id', UserController.show);

// POST /users - Cria um novo usuário
userRoutes.post('/', UserController.store);

// PUT /users/:id - Atualiza um usuário
userRoutes.put('/:id', UserController.update);

// destroy /users/:id - Deleta um usuário
userRoutes.delete('/:id', UserController.destroy);

export default userRoutes;
