// Enthält die geschützten Routen, die nur zugänglich sind, wenn der Benutzer authentifiziert ist.

import {Router} from 'express';
import {changePassword, deleteUser, getUser, setProfilePic} from '../controllers/userController';
import {verifyToken} from "../controllers/middlewares/verifyToken";

const userRouter = Router();


// TODO
userRouter.post('/change-password',verifyToken,changePassword)
userRouter.post('/profile_pic',verifyToken,setProfilePic);
userRouter.delete('/delete/account', verifyToken,deleteUser);
userRouter.get("/profile", verifyToken,getUser);



export default userRouter;
