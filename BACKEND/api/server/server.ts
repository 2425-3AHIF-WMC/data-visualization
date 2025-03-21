import express from "express";
import {Database} from 'sqlite';
import {StatusCodes} from "http-status-codes";

/*  Hier wird der Express server gestartet
* bindet Middleware (z.B. cors, bodyparser) ein
* lädt die API-Routen*/


import express from 'express';
import cors from 'cors';
import dataRoutes from '../routes/dataRoutes';
import userRoutes from '../routes/userRoutes';
import analysisRoutes from '../routes/analysisRoutes';
import systemRoutes from '../routes/systemRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routen
app.use('/api/data', dataRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/system', systemRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
