import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {User} from "../../models";
import {jwtConfig} from "../../config/jwtConfig";


//TODO JWT kacke funktioniert nicht ahhhhhhh was ist dieser Errorrrrr
const createToken = (userId: string): string => {
    return jwt.sign(
        { id: userId },           // Payload: Hier ist das Objekt, das in das Token eingebaut wird
        jwtConfig.secret ,         // Geheimer Schlüssel aus jwtConfig
        { expiresIn: jwtConfig.expiresIn }  // Ablaufzeit aus jwtConfig
    );
};

// loginUser
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong email or password' });
        }

        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong email or password' });
        }

        const token = createToken(user.id);
        return res.status(StatusCodes.OK).json({ token });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error", error });
    }
};

// signInUser
export const signInUser = async (req: Request, res: Response) => {
    const { firstname, lastname, password, email, telNr, profile_pic } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create(
            firstname,
            lastname,
            email,
            telNr,
            hashedPassword,
            profile_pic
        );

        const token = createToken(newUser.id);
        return res.status(StatusCodes.CREATED).json({ token });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Error", error });
    }
};
//    Login-/Register-Logik inkl. JWT-Erzeugung
/*Verantwortlich für Authentifizierung (also alles rund um Login, Registrierung, JWT-Erzeugung).

Typische Funktionen:

    loginUser(req, res)

    registerUser(req, res)

    ggf. logoutUser(req, res)*/


// 1. Imports (User-Modell, bcrypt, jwt, jwtConfig)
// 2. loginUser: async-Funktion
//     a) finde User anhand der E-Mail
//     b) vergleiche Passwort mit bcrypt
//     c) wenn korrekt → JWT erzeugen → Rückgabe { token, user }
// 3. exportiere loginUser




