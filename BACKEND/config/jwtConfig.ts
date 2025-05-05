// # Konfiguration für JWT, z.B. Secret Key
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
const expiresIn:string = process.env.JWT_EXPIRES_IN || "1d";

if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
}

export const jwtConfig = {
    secret,
    expiresIn
};
