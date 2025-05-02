/*Verantwortlich für benutzerspezifische Aktionen, nachdem der User eingeloggt ist.

Typische Funktionen:

    getUserProfile(req, res) → gibt Daten zum eingeloggten User zurück

    updateUserProfile(req, res) → erlaubt das Ändern von z. B. Name, E-Mail

    getAllUsers(req, res) → nur für Admins

    deleteUser(req, res) → User löschen*/
import {RequestWithUser} from "./middlewares/verifyToken";
import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {User} from "../../models";
import bcrypt from 'bcrypt';

export const deleteUser = async (req: RequestWithUser, res: Response) => {

    const userId = req.user?.id;
    if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: 'User not authorized'});
        return
    }
    try {
        const user = await User.findByPk(parseInt(userId));
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({message: 'User not found'});
            return
        }
        await User.deleteById(parseInt(userId));
        res.status(StatusCodes.OK).json({message: 'User successfully deleted'});
        return
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'Server error', error});
        return
    }
}

export const changePassword = async (req: RequestWithUser, res: Response) => {
    const userId = req.user?.id;
    const {currentPassword, newPassword} = req.body;

    if (!userId) {
        res
            .status(StatusCodes.UNAUTHORIZED)
            .json({message: 'Not authenticated'});
        return
    }
    if (!currentPassword || !newPassword) {
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({message: 'Both currentPassword and newPassword are required'});
        return
    }

    try {
        // 1. Aktuelles gehashte Passwort holen
        const storedHash = await User.getPasswordHashById(parseInt(userId));
        if (!storedHash) {
            res
                .status(StatusCodes.NOT_FOUND)
                .json({message: 'User not found'});
            return
        }

        // 2. Prüfen, ob currentPassword stimmt
        const matches = await User.verifyPassword(String(storedHash), currentPassword);
        if (!matches) {
            res
                .status(StatusCodes.UNAUTHORIZED)
                .json({message: 'Current password is incorrect'});
            return
        }

        // 3. Neues Passwort hashen
        const newHash = await bcrypt.hash(newPassword, 10);

        // 4. In der DB speichern
        await User.updatePasswordById(parseInt(userId), newHash);

        res
            .status(StatusCodes.OK)
            .json({message: 'Password changed successfully'});
        return
    } catch (err) {
        console.error('changePassword error', err);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({message: 'Server error', error: err});
        return
    }
};

/*export const loginUser = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    try {
        // 1. user anhand der mail finden
        const user = await User.findByEmail(email);
        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: 'Wrong email or password'});
            return;
        }

        // 2. password überprüfen
        const isPasswordCorrect = await User.verifyPassword(user.password, password);
        if (!isPasswordCorrect) {
            res.status(StatusCodes.UNAUTHORIZED).json({message: 'Wrong email or password'});
            return;
        }

        // TODO
        // 3. JWT-Token erstellen

        // 4. Erfolgreiches login: token zurückgeben

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Server error", error});
        return;
    }
}

export const signInUser = async (req: Request, res: Response) => {
    const {firstname, lastname, password, email, telNr, profile_pic} = req.body;

    try {
        var createUser = User.create(firstname, lastname, password, email, telNr, profile_pic);

// das mit dem profilbild muss noch gefixt werden!!!
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({message: "Error", error});
        return;
    }
}*/

// TODO account settings, user will seine daten ändern oder so

/*GET/PUT /user/profile – für Name, E-Mail, Bild

POST /user/change-password

DELETE /user/account


POST /user/upload-avatar*/
// backend/controllers/userController.js

// 1. Imports: User-Modell, eventuell JWT-Verifikation
// 2. getUserProfile(req, res)
// 3. updateUserProfile(req, res)
// 4. exportiere alle Funktionen
