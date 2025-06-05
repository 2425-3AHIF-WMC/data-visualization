import express from 'express';
import cors from 'cors';
import dataRouter from "../routes/dataRoutes";
import userRouter from '../routes/userRoutes';
//import analysisRoutes from '../routes/analysisRoutes';
import visualizationRouter from '../routes/visualizationRoutes';
//import systemRoutes from '../routes/systemRoutes';
import authRoutes from "../routes/authRoutes";
import { StatusCodes } from "http-status-codes";
import { connectToDatabase } from '../../config/db';
/*  Hier wird der Express server gestartet
* bindet Middleware (z.B. cors, bodyparser) ein
* lädt die API-Routen*/
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Routen
app.use('/api/datasets', dataRouter);
app.use('/api/user', userRouter);
app.use('/api/visualizations', visualizationRouter);
app.use('/api/auth', authRoutes);
// app use authroutes
app.use((_, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Route nicht gefunden!" });
    return;
});
const PORT = 3000;
const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server läuft auf Port ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Server konnte nicht gestartet werden:', error);
        process.exit(1); // App abbrechen, wenn DB-Verbindung fehlschlägt
    }
};
//todo
(async () => {
    await startServer();
})();
export default app;
