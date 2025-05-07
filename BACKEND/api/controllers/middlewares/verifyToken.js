import jwt from 'jsonwebtoken';
import { jwtConfig } from "../../../config/jwtConfig";
export const verifyToken = (req, res, next) => {
    // Holen des Tokens aus dem Authorization-Header
    // Todo
    const token = req.header('Authorization')?.replace('Bearer ', ''); // was ist das
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        // Überprüfen und Decodieren des Tokens
        const decoded = jwt.verify(token, jwtConfig.secret);
        // Benutzerinformationen aus dem Token extrahieren und in req.user speichern
        req.user = { id: decoded.id }; // Wir gehen davon aus, dass die ID im Token enthalten ist
        //todo brauche ich next(); wirklich?
        next(); // Weiter zu der nächsten Middleware oder Route
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};
