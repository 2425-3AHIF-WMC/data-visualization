import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {jwtConfig} from "../../../config/jwtConfig";

export interface RequestWithUser extends Request {
    user?: { id: string }; // Benutzerobjekt mit ID
}

export const verifyToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
    // Holen des Tokens aus dem Authorization-Header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ message: 'No token provided' }); return
    }

    try {
        // Überprüfen und Decodieren des Tokens
        const decoded = jwt.verify(token, jwtConfig.secret as jwt.Secret);

        // Benutzerinformationen aus dem Token extrahieren und in req.user speichern
        req.user = { id: (decoded as any).id }; // Wir gehen davon aus, dass die ID im Token enthalten ist

        //todo brauche ich next(); wirklich?
        next(); // Weiter zu der nächsten Middleware oder Route
    } catch (error) {
         res.status(401).json({ message: 'Invalid or expired token' }); return;
    }
};