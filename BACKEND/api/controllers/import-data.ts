import {StatusCodes} from 'http-status-codes';
import {Response} from 'express';
import csv from "csvtojson";
import {RequestWithUser} from "./middlewares/verifyToken";
import {User} from "../../models";
import path, {dirname} from "path";
import {promisify} from "node:util";
import * as fs from "node:fs";
import {fileURLToPath} from "node:url";

const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);

export const saveUserImport = async (userId:string, data:any, format:string, sourceUrl: string | null) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);


        const baseDir = path.join(__dirname, '..', '..', '..', 'user_data');

        // Finde den passenden Ordnernamen, z.B. "1_Doe_J"
        const userDirs = await readdirAsync(baseDir);
        const userFolder = userDirs.find(dir => dir.startsWith(`${userId}_`))

        if (!userFolder) {
            throw new Error(`Kein Verzeichnis für User-ID ${userId} gefunden.`);
        }

        const userDir = path.join(baseDir, userFolder);

        // Dateiname mit Zeitstempel
        const now = new Date();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `import_${timestamp}.${format}`;
        const filePath = path.join(userDir, filename);

        const formattedDate = now.toLocaleDateString('de-DE');

        // Dateiinhalt vorbereiten – mit Meta-Angabe
        const payload = JSON.stringify({
            meta: {
                url: sourceUrl,
                created: formattedDate,
                lastModified: formattedDate
            },
            data
        }, null, 2);
try{
        // Datei speichern
        await writeFileAsync(filePath, payload, 'utf-8');
        return filePath;
    }catch (err){
        console.error('Fehler beim Speichern in saveUserImport:', err);
        throw err;
    }
}


export const importData = async (req: RequestWithUser, res: Response) => {
    const {source,   content,datasetName} = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Not authenticated"});
        return;
    }

    if (!source || ![ 'json', 'csv'].includes(source)) {
        res.status(StatusCodes.BAD_REQUEST).json({error: 'Invalid or missing source.'});
        return;
    }

    if (!datasetName || typeof datasetName !== 'string' || datasetName.trim() === '') {
        res.status(StatusCodes.BAD_REQUEST).json({error: 'Dataset name is required.'});
        return;
    }

    let data: any[] = [];

    try {
        const user = await User.findById(+userId);

        if (!user) {
            res.status(StatusCodes.NOT_FOUND).json({message: "User not found"});
            return
        }

         if (source === 'json') {
            if (!content) {
                res.status(StatusCodes.BAD_REQUEST).json({error: 'No JSON content provided.'});
                return;
            }
            data = typeof content === 'string' ? JSON.parse(content) : content;

            if (!Array.isArray(data)) {
                res.status(StatusCodes.BAD_REQUEST).json({error: 'Expected JSON array of objects.'});
                return;
            }

        } else if (source === 'csv') {
            if (!content) {
                res.status(StatusCodes.BAD_REQUEST).json({error: 'No CSV content provided.'});
                return;
            }
            data = await csv().fromString(content);
        }
        await saveUserImport(userId, data, 'json', null);

        res.status(StatusCodes.OK).json({data});

    } catch (err: any) {
        console.error('Import error:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to process import.',
            details: err.message
        }); return;
    }
};


/*export const fetchFromUrl = async (req: Request, res: Response) => {
    const {url} = req.body;

    if (!url) {
        res.status(StatusCodes.BAD_REQUEST).json({error: "No URL provided."});
        return ;
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
            res.status(400).json({error: "Unsupported file format."}); return;
        }

        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        res.status(500).json({error: "Failed to fetch or parse the URL."}); return;
    }

}*/


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