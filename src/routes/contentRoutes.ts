import Router from 'express';
import ContentController  from '../controllers/ContentController.js';
import upload from '../middlewars/multer.js';

const contentRoutes = Router();

contentRoutes.get('/', ContentController.index);
contentRoutes.get('/:id', ContentController.show);
contentRoutes.post('/', upload.array('media', 10), ContentController.store);
contentRoutes.put('/:id', upload.array('media', 10),ContentController.update);
contentRoutes.delete('/:id', ContentController.destroy);
contentRoutes.post('/increment-views/:id', ContentController.incrementViews);
contentRoutes.post('/increment-votes/:id', ContentController.incrementVotes);
contentRoutes.get('/tag/:tagName', ContentController.findContentByTag)

export default contentRoutes