import express from 'express';
import cors from 'cors';
import dataRoutes from '../routes/dataRoutes';
import userRoutes from '../routes/userRoutes';
import analysisRoutes from '../routes/analysisRoutes';
import systemRoutes from '../routes/systemRoutes';
import authRoutes from "../routes/authRoutes";
import {StatusCodes} from "http-status-codes";
import { connectToDatabase } from '../../config/db';

/*  Hier wird der Express server gestartet
* bindet Middleware (z.B. cors, bodyparser) ein
* lädt die API-Routen*/

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/data', dataRoutes);
app.use('/api/user', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/system', systemRoutes);
// app use authroutes

const PORT = process.env.PORT || 3000;

const startServer= async ()=>{
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server läuft auf Port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Server konnte nicht gestartet werden:', error);
        process.exit(1); // App abbrechen, wenn DB-Verbindung fehlschlägt

    }
}
//todo
await startServer(); // boah digga idkkkkk

export default app;
