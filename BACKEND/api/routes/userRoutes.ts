import {Router} from 'express';
import {loginUser, signInUser} from '../controllers/userController';

const userRouter = Router();


// TODO
userRouter.post('/login', loginUser);
userRouter.post('/signIn',signInUser);



export default userRouter;
