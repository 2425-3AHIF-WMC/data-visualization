/* Stellt die Verbindung zur SQL db her (postgresql) */

import {Pool} from 'pg'; // fixe ich später
import {dbConfig} from "./config";

export const pool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
})

export const connectToDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL verbunden');

        // Optional: client freigeben, wenn du ihn nicht brauchst
        client.release();
    } catch (error) {
        console.error('❌ Fehler bei Verbindung zur DB:', error);
        process.exit(1); // Optional: App abbrechen bei Verbindungsfehler
    }
};