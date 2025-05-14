// routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// GET /users - Lista todos os usuários
router.get('/', UserController.index);

// GET /users/:id - Busca usuário por ID
router.get('/:id', UserController.show);

// POST /users - Cria um novo usuário
router.post('/', UserController.store);

// PUT /users/:id - Atualiza um usuário
router.put('/:id', UserController.update);

// DELETE /users/:id - Deleta um usuário
router.delete('/:id', UserController.destroy);

export default router;
