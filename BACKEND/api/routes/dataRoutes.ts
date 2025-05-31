import express from "express";
import {
    deleteDatasetsFromUser,
    fetchDatasetsFromUser,
    findDatasetById,
    importUserDatasets, updateDatasetById
} from "../controllers/dataController";
import {verifyToken} from "../controllers/middlewares/verifyToken";

const dataRouter = express()

dataRouter.post('/import', verifyToken, importUserDatasets);
dataRouter.get('/',verifyToken,fetchDatasetsFromUser);
dataRouter.delete('/:fileId',verifyToken,deleteDatasetsFromUser);
dataRouter.get('/:fileId',verifyToken,findDatasetById)
dataRouter.put('/:fileId', verifyToken,updateDatasetById);

export default dataRouter;