import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import axios from "axios";
import csv from "csvtojson";
import {Pool as MySQLPool, createPool as createMySQLPool} from 'mysql2/promise';
import {Client as PGClient} from 'pg';

// todo
// url -> done
// json + csv -> done
// maybe sql -> in Progress
// idk

const importFromUrl = async (req: Request, res: Response) => {
    const {url} = req.body;

    if (!url) {
        res.status(StatusCodes.BAD_REQUEST).json({error: "No URL provided."});
    }

    try {
        const response = await axios.get(url);

        const contentType = response.headers["content-type"];
        let data;

        if (contentType.includes("application/json")) {
            data = response.data;
        } else if (contentType.includes("text/csv") || url.endsWith(".csv")) {
            data = await csv().fromString(response.data);
        } else {
            return res.status(400).json({error: "Unsupported file format."});
        }

        res.json({data});
    } catch (err) {
        res.status(500).json({error: "Failed to fetch or parse the URL."});
    }

}
const importJson = async (req: Request, res: Response) => {
    const {jsonContent} = req.body;
    if (jsonContent === undefined) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error: 'No JSON content provided.'});
    }

    try {
        // Falls es ein String ist, parsen
        let data: any;
        if (typeof jsonContent === 'string') {
            data = JSON.parse(jsonContent);
        } else {
            // schon ein Objekt/Array
            data = jsonContent;
        }

        if (!Array.isArray(data)) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({error: 'Expected JSON array of objects.'});
        }
        return res.status(StatusCodes.OK).json({data});
    } catch (err: any) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({error: 'Invalid JSON format.', details: err.message});
    }
}
const importCSV= async (req:Request,res:Response)=>{
    // Wir erwarten im JSON-Body ein Feld csvContent mit dem reinen CSV-Text
    const { csvContent } = req.body;
    if (!csvContent) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: 'Kein csvContent im Body gefunden.' });
    }

    try {
        // CSV parsen
        const data = await csv().fromString(csvContent);
        return res.status(StatusCodes.OK).json({ data });
    } catch (err: any) {
        console.error('CSV-Parsing-Fehler:', err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Fehler beim Parsen der CSV-Daten.', details: err.message });
    }
}

/*export const importFromSQL = async (req: Request, res: Response) => {
    const {dbType, host, user, password, database, port} = req.body;

    if (!dbType || !host || !user || !database) {
        return res.status(StatusCodes.BAD_REQUEST).json({error: 'Missing required database configuration.'});
    }

    try {
        let tables: string[] = [];

        if (dbType === 'mysql') {
            const pool: MySQLPool = createMySQLPool({
                host,
                user,
                password,
                database,
                port: port || 3306
            });

            const [rows]: [any[], any] = await pool.query('SHOW TABLES');

            // Extrahiere Tabellenamen aus dem Objekt
            tables = rows.map((row: any) => {
                const value = Object.values(row)[0];
                if (typeof value === 'string') {
                    return value;
                }
                throw new Error('Unexpected non-string table name');
            });

            await pool.end();
        } else if (dbType === 'postgres') {
            const client = new PGClient({
                host,
                user,
                password,
                database,
                port: port || 5432,
            });

            await client.connect();

            const result = await client.query(`
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_type = 'BASE TABLE'
            `);

            tables = result.rows.map(row => row.table_name);

            await client.end();
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({error: 'Unsupported database type.'});
        }

        res.status(StatusCodes.OK).json({tables});

    } catch (error) {
        console.error('Database error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Database connection or query failed.'});
    }
};*/
// Route zum Abrufen der Daten aus einer ausgewählten Tabelle
/*const getTableData = async (req: Request, res: Response) => {
    const {dbType, dbConfig, tableName} = req.body;

    if (!dbType || !dbConfig || !tableName) {
        return res.status(StatusCodes.BAD_REQUEST).json({error: 'Missing required parameters.'});
    }

    try {
        let dbConnection;

        // Verbindung je nach Datenbanktyp aufbauen
        if (dbType === 'mysql') {
            dbConnection = new Pool(dbConfig);
        } else if (dbType === 'postgres') {
            dbConnection = new Client(dbConfig);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({error: 'Unsupported database type'});
        }

        await dbConnection.connect();

        // Abfrage für alle Daten in der Tabelle
        const query = `SELECT *
                       FROM ${tableName}`;

        // Daten abfragen
        const result = await dbConnection.query(query);
        const data = dbType === 'mysql' ? result[0] : result.rows;

        res.json({data});

        await dbConnection.end();
    } catch (err) {
        console.error(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: 'Failed to fetch data from the table.'});
    }
};
*/