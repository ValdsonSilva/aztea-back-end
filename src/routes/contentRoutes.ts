import Router from 'express';
import ContentController  from '../controllers/ContentController.js';

const router = Router();

router.get('/', ContentController.index);
router.get('/:id', ContentController.show);
router.post('/', ContentController.store);
router.put('/:id', ContentController.update);
router.delete('/:id', ContentController.destroy);
router.post('/increment-views/:id', ContentController.incrementViews);
router.post('/increment-votes/:id', ContentController.incrementVotes);
router.get('/tag/:tagName', ContentController.findContentByTag)

export default router