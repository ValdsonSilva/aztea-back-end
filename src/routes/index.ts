import express from 'express';
import userRoutes from './userRoutes.js';
import contentRoutes from './contentRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import tagRoutes from './tagRoutes.js';
import serieRoutes from './serieRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/contents', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/series', serieRoutes);

export default router;