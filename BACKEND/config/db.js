/* Stellt die Verbindung zur SQL db her (postgresql) */
// todo tabelle erstellen, und nicht vergessen: attribut: is_confirmed (bool), confirmation_token(string). confirmation_roken_expires (datetime)
import { Pool } from 'pg'; // fixe ich später
import { dbConfig } from "./config";
export const pool = new Pool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
});
export const connectToDatabase = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ PostgreSQL verbunden');
        await client.query(`
            CREATE TABLE IF NOT EXISTS user_profiles (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) not null,
                last_name VARCHAR(100) not null,
                password varchar(100) not null,
                phone_number VARCHAR(30),
                email VARCHAR(255) UNIQUE not null,
                profile_picture BYTEA
                );
        `);
        // Optional: client freigeben, wenn du ihn nicht brauchst
        client.release();
    }
    catch (error) {
        console.error('❌ Fehler bei Verbindung zur DB:', error);
        process.exit(1); // Optional: App abbrechen bei Verbindungsfehler
    }
};
