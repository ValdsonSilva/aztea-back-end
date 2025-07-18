import express from 'express';
import userRoutes from '../../user/routes/userRoutes.js';
import contentRoutes from '../../content/routes/contentRoutes.js';
import categoryRoutes from '../../category/routes/categoryRoutes.js';
import tagRoutes from '../../tag/routes/tagRoutes.js';
import serieRoutes from '../../series/routes/serieRoutes.js';
import favoriteRoutes from '../../favorite/routes/favoriteRoutes.js';
import notificationRoutes from '../../notification/routes/notificationRoutes.js';
import commentRoutes from '../../comment/routes/commentRoutes.js';
import contentTranslationRoutes from '../../contentTranslation/routes/contentTranslationRoutes.js';
import { authenticateToken } from '../middlewars/auth.js';
import loginRoutes from './loginRoutes.js';
import mediaRoutes from '../../media/routes/mediaRoutes.js';

const router = express.Router();

// públicas
router.use('/auth', loginRoutes);
router.use('/users', userRoutes);
// router.use('/submissions', submissionRoutes);

router.use(authenticateToken); // Middleware aplicado globalmente a partir daqui

// privadas
// router.use('/users', userRoutes);
router.use('/contents', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/series', serieRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/notifications', notificationRoutes);
router.use('/comments', commentRoutes);
router.use('/content-translations', contentTranslationRoutes);
router.use('/medias', mediaRoutes);
// router.use('/submissions', submissionRoutes);

export default router;