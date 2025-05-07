import { StatusCodes } from 'http-status-codes';
import { User } from "../../models";
import bcrypt from 'bcrypt';
export const deleteUser = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not authorized' });
        return;
    }
    try {
        const user = await User.findById(parseInt(userId));
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            return;
        }
        await user.delete();
        res.status(StatusCodes.OK).json({ message: 'User successfully deleted' });
        return;
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
        return;
    }
};
export const changePassword = async (req, res) => {
    const id = req.user?.id;
    const { currentPassword, newPassword } = req.body;
    if (!id) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authenticated" });
        return;
    }
    if (!currentPassword || !newPassword) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Both passwords required" });
        return;
    }
    const user = await User.findById(+id);
    if (!user) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        return;
    }
    const ok = await user.verifyPassword(currentPassword);
    if (!ok) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Current password wrong" });
        return;
    }
    // Neues Passwort hashen und speichern
    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;
    // Entweder so, wenn du die statische Methode beibehältst:
    await User.updatePasswordById(user.id, newHash);
    // Oder so, falls du im Model eine Instanz-Methode `updatePassword()` ergänzt:
    // await user.updatePassword();
    res.status(StatusCodes.OK).json({ message: "Password changed" });
    return;
};
export const updateProfile = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'Not authenticated' });
    }
    const { firstname, lastname, mail, telNr, profile_pic } = req.body;
    try {
        const user = await User.findById(+userId);
        if (!user) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'User not found' });
        }
        // Nur die übergebenen Felder updaten
        await user.updateProfile({ firstname, lastname, mail, telNr, profile_pic });
        // Frisch serialisiertes Profil zurückgeben (ohne Passwort)
        return res
            .status(StatusCodes.OK)
            .json({ user: user.toJSON() });
    }
    catch (err) {
        console.error('updateProfile error', err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Server error', error: err });
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
