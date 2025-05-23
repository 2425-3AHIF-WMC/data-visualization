import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {User} from "../../models";
import {jwtConfig} from "../../config/jwtConfig";


// TODO: email und vorname ins jwt zu speicher wäre auch voll die leinwand
//TODO: Was ist wenn der Token abgelaufen ist???????????

const createToken = (
    userId: number,
    email: string,
    firstname: string,
    lastname: string): string => {
    return jwt.sign(
        {
            id: userId,
            email,
            firstname,
            nachname: lastname
        },           // Payload: Hier ist das Objekt, das in das Token eingebaut wird
        jwtConfig.secret,         // Geheimer Schlüssel aus jwtConfig
        {expiresIn: '1h'}  // Ablaufzeit aus jwtConfig
    );
};

// loginUser
export const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    try {
        const user = await User.findByEmail(email);
        console.log("user " + user);

        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: 'Wrong email or password'});
            return
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: 'Wrong email or password'});
            return
        }

        const token = createToken(user.id!,user.email,user.firstname,user.lastname);
        res.status(StatusCodes.OK).json({token});
        return
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Server error", error});
        return
    }
};

// signInUser
export const registerUser = async (req: Request, res: Response) => {
    const {firstname, lastname, password, email, telNr, profile_pic} = req.body;
    try {
        const user = new User({firstname, lastname, email: email, telNr, profile_pic, password});
        await user.save();

        const token = createToken(user.id!,user.email,user.firstname,user.lastname);
        res.status(StatusCodes.CREATED).json({token, user: user.toJSON()});
        return
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'Error creating user', error: err});
        return
    }
};
//    Login-/Register-Logik inkl. JWT-Erzeugung
/*Verantwortlich für Authentifizierung (also alles rund um Login, Registrierung, JWT-Erzeugung).

//todo Token refresh

// todo logout









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




