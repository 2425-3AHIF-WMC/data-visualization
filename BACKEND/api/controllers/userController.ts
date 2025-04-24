// User Authentifizierung
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {User} from "../../models";

export const loginUser = async (req: Request, res: Response) => {
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
}