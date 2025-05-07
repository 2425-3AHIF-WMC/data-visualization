// enthält Umgebungsvariablen (z.B. API-Keys, Ports)
// dotenv ist eine Node.js Bib, mit der Umgebungsvar aus einer .env geladen werden kann
import dotenv from 'dotenv';
dotenv.config({ path: './api/.env' });
export const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
};
