import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../../models";
import { jwtConfig } from "../../config/jwtConfig";
//TODO JWT kacke funktioniert nicht ahhhhhhh was ist dieser Errorrrrr
// okay problem liegt by expires in
const createToken = (userId) => {
    return jwt.sign({ id: userId }, // Payload: Hier ist das Objekt, das in das Token eingebaut wird
    jwtConfig.secret, // Geheimer Schlüssel aus jwtConfig
    { expiresIn: '1h' } // Ablaufzeit aus jwtConfig
    );
};
// loginUser
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong email or password' });
            return;
        }
        const isPasswordCorrect = bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong email or password' });
            return;
        }
        const token = createToken(user.id);
        res.status(StatusCodes.OK).json({ token });
        return;
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error", error });
        return;
    }
};
// signInUser
export const registerUser = async (req, res) => {
    const { firstname, lastname, password, email, telNr } = req.body;
    console.log(firstname, lastname, email, telNr);
    try {
        const user = new User({ firstname, lastname, mail: email, telNr, password });
        console.log("user: " + user.mail, user.password, user.lastname, user.firstname, user.telNr);
        await user.save();
        const token = createToken(user.id);
        const response = {
            token,
            user: {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.mail,
                telNr: user.telNr,
            }
        };
        res.status(StatusCodes.CREATED).json(response);
        return;
        //  res.status(StatusCodes.CREATED).json({ token, user: user.toJSON() }); return
    }
    catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error creating user', error: err });
        return;
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
