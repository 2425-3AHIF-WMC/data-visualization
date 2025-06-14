import {verifyToken} from "../controllers/middlewares/verifyToken";
import {Router} from 'express';
import {postVisualization, getVisualizations, deleteVisualization,getVisualizationsById,getVisualizationsCount} 
from '../controllers/visualizationController';

const visualizationRouter = Router();

visualizationRouter.post('/', verifyToken, postVisualization);
visualizationRouter.get('/', verifyToken, getVisualizations);
visualizationRouter.get('/count', verifyToken, getVisualizationsCount);
visualizationRouter.delete('/:id', verifyToken, deleteVisualization);
visualizationRouter.get('/:id', verifyToken, getVisualizationsById);

export default visualizationRouter;