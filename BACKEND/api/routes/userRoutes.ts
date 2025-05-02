// Enthält die geschützten Routen, die nur zugänglich sind, wenn der Benutzer authentifiziert ist.

import {Router} from 'express';
import {changePassword, deleteUser} from '../controllers/userController';
import {verifyToken} from "../controllers/middlewares/verifyToken";

const userRouter = Router();


// TODO
userRouter.patch('/change-password',verifyToken,changePassword)
userRouter.delete('/', verifyToken,deleteUser);




export default userRouter;
