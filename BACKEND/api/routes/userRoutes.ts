// Enthält die geschützten Routen, die nur zugänglich sind, wenn der Benutzer authentifiziert ist.

import {Router} from 'express';
import {changePassword, deleteUser, getUser, setProfilePic,updateProfile} from '../controllers/userController';
import {verifyToken} from "../controllers/middlewares/verifyToken";

const userRouter = Router();


// TODO
userRouter.post('/change-password',verifyToken,changePassword);
userRouter.post('/profile-picture/set',verifyToken,setProfilePic);
userRouter.post('/profile-picture',verifyToken,setProfilePic);
userRouter.delete('/delete/account', verifyToken,deleteUser);
userRouter.get("/profile", verifyToken,getUser);
userRouter.put('/profile', verifyToken, updateProfile);




export default userRouter;
