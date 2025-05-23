import express from 'express';
import userRoutes from './userRoutes.js';
import contentRoutes from './contentRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import tagRoutes from './tagRoutes.js';
import serieRoutes from './serieRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import commentRoutes from './commentRoutes.js';
import contentTranslationRoutes from './contentTranslationRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/contents', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/series', serieRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/notifications', notificationRoutes);
router.use('/comments', commentRoutes);
router.use('/content-translations', contentTranslationRoutes);

export default router;