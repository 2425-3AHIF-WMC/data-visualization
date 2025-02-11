import express from "express";
import {Database} from 'sqlite';
import {StatusCodes} from "http-status-codes";

/*  Hier wird der Express server gestartet
* bindet Middleware (z.B. cors, bodyparser) ein
* lädt die API-Routen*/
