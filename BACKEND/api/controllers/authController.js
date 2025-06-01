import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from "../../models";
import { jwtConfig } from "../../config/jwtConfig";
import path from "path";
import { promises as fs } from "fs";
import { dirname } from 'path';
import { fileURLToPath } from "node:url";
// TODO: email und vorname ins jwt zu speicher wäre auch voll die leinwand
//TODO: Was ist wenn der Token abgelaufen ist???????????
const createToken = (userId, email, firstname, lastname) => {
    return jwt.sign({
        id: userId,
        email,
        firstname,
        lastname
    }, // Payload: Hier ist das Objekt, das in das Token eingebaut wird
    jwtConfig.secret, // Geheimer Schlüssel aus jwtConfig
    { expiresIn: '1h' } // Ablaufzeit aus jwtConfig
    );
};
async function createUserFolderAndThemeFile(folderName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    // relativer Pfad zu "user_data/folderName"
    const folderPath = path.join(__dirname, '..', '..', '..', 'user_data', folderName);
    const jsonFilePath = path.join(folderPath, 'themeChanges.json');
    try {
        await fs.mkdir(folderPath, { recursive: true });
        console.log(`Ordner "${folderPath}" wurde erstellt.`);
        await fs.writeFile(jsonFilePath, '{}', 'utf-8');
        console.log(`Leere Datei "${jsonFilePath}" wurde erstellt.`);
    }
    catch (error) {
        console.error('Fehler beim Erstellen des Ordners:', error);
    }
}
function capitalizeFirstLetter(str) {
    if (!str)
        return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
// loginUser
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        console.log("user " + user);
        if (!user) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong email or password' });
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Wrong email or password' });
            return;
        }
        const token = createToken(user.id, user.email, user.firstname, user.lastname);
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
    const { firstname, lastname, password, email, telNr, profile_pic } = req.body;
    const formattedFirstname = capitalizeFirstLetter(firstname);
    const formattedLastname = capitalizeFirstLetter(lastname);
    try {
        const user = new User({ firstname: formattedFirstname, lastname: formattedLastname, email: email, telnr: telNr, profile_pic, password });
        await user.save();
        const token = createToken(user.id, user.email, user.firstname, user.lastname);
        // erstelle einen folder für den user???: bsp: 1_Doe_J   (id: 1, lastname: Doe, firstname: Jane)
        await createUserFolderAndThemeFile(user.id + '_' + user.lastname + '_' + user.firstname[0]);
        res.status(StatusCodes.CREATED).json({ token, user: user.toJSON() });
    }
    catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error creating user', error: err });
        return;
    }
};
