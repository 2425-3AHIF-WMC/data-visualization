// # Routen für Login, Registrierung
import {Router} from 'express';
import {loginUser, registerUser} from "../controllers/authController";
const authRoutes=Router()

export default authRoutes;

authRoutes.post('/login',loginUser);
authRoutes.post('/register',registerUser);

