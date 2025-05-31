import express from "express";
import { deleteDatasetsFromUser, fetchDatasetsFromUser, importUserDatasets } from "../controllers/dataController";
import { verifyToken } from "../controllers/middlewares/verifyToken";
const dataRouter = express();
dataRouter.post('/import', verifyToken, importUserDatasets);
dataRouter.get('/', verifyToken, fetchDatasetsFromUser);
dataRouter.delete('/:fileId', verifyToken, deleteDatasetsFromUser);
export default dataRouter;
