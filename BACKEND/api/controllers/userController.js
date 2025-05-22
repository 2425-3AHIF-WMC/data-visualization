/*Verantwortlich für benutzerspezifische Aktionen, nachdem der User eingeloggt ist.

Typische Funktionen:

    getUserProfile(req, res) → gibt Daten zum eingeloggten User zurück

    updateUserProfile(req, res) → erlaubt das Ändern von z. B. Name, E-Mail

    getAllUsers(req, res) → nur für Admins

    deleteUser(req, res) → User löschen*/
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
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Not authenticated' });
        return;
    }
    const { firstname, lastname, mail, telNr, profile_pic } = req.body;
    try {
        const user = await User.findById(+userId);
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
            return;
        }
        // Nur die übergebenen Felder updaten
        await user.updateProfile({ firstname, lastname, email: mail, telNr, profile_pic });
        // Frisch serialisiertes Profil zurückgeben (ohne Passwort)
        res.status(StatusCodes.OK).json({ user: user.toJSON() });
    }
    catch (err) {
        console.error('updateProfile error', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error: err });
        return;
    }
};
export const setProfilePic = async (req, res) => {
    const userId = req.user.id;
    const profilePic = req.body.profilePic; // kommt als binär datei
    try {
        const existingUser = await User.findById(+userId);
        if (existingUser) {
            await existingUser.setProfilePicture(profilePic);
        }
        res.status(StatusCodes.OK).json({ message: 'Profile picture updated successfully.' });
    }
    catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating profile picture.' });
        return;
    }
};
export const getProfilePic = async (req, res) => {
    const userId = req.user?.id;
    try {
        const existingUser = await User.findById(+userId);
        if (!existingUser) {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found.' });
            return;
        }
        res.status(StatusCodes.OK).json({ profile_pic: existingUser.profile_pic });
    }
    catch (error) {
        console.error('Error getting profile picture:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error retrieving profile picture.' });
        return;
    }
};
export const getUser = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Not authenticated" });
        return;
    }
    try {
        const user = await User.findById(+userId);
        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
            return;
        }
        // toJSON() entfernt das Passwort und alle sensiblen Daten
        res.status(StatusCodes.OK).json({ user: user.toJSON() });
    }
    catch (err) {
        console.error("getUser error", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error", error: err });
        return;
    }
};
