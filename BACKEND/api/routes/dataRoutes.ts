import express from "express";
import { importData} from "../controllers/import-data";
import {verifyToken} from "../controllers/middlewares/verifyToken";

const dataRouter = express()

dataRouter.post('/import', verifyToken, importData);

export default dataRouter;