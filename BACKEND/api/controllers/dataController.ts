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
const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const unlinkAsync = promisify(fs.unlink);

export const saveUserImport = async (userId: string, data: any, format: string, sourceUrl: string | null, datasetName: string) => {
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


    const existingImports = (await readdirAsync(userDir))
        .filter(f => f.startsWith('import_') && f.endsWith('.json'));

    const existingIds = existingImports.map(filename => {
        const match = filename.match(/import_.*?_(\d+)\.json$/);
        return match ? parseInt(match[1], 10) : 0;
    }).filter(id => id > 0);

    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newId = maxId + 1;


    // Dateiname mit neuem ID und Zeitstempel
    const now = new Date();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `import_${timestamp}_${newId}.${format}`;
    const filePath = path.join(userDir, filename);

    const formattedDate = now.toLocaleDateString('de-DE');

    // Dateiinhalt vorbereiten – mit Meta-Angabe
    const payload = JSON.stringify({
        meta: {
            id: newId,
            datasetName: datasetName,
            url: sourceUrl,
            created: formattedDate,
            lastModified: formattedDate
        },
        data
    }, null, 2);
    try {
        await writeFileAsync(filePath, payload, 'utf-8');
        return filePath;
    } catch (err) {
        console.error('Fehler beim Speichern in saveUserImport:', err);
        throw err;
    }
}

export const importUserDatasets = async (req: RequestWithUser, res: Response) => {
    const {source, content, datasetName} = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Not authenticated"});
        return;
    }

    if (!source || !['json', 'csv'].includes(source)) {
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
        await saveUserImport(userId, data, 'json', null, datasetName);

        res.status(StatusCodes.OK).json({data});

    } catch (err: any) {
        console.error('Import error:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Failed to process import.',
            details: err.message
        });
        return;
    }
};

export const fetchDatasetsFromUser = async (req: RequestWithUser, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({message: "Not authenticated"});
        return;
    }

    try {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const baseDir = path.join(__dirname, '..', '..', '..', 'user_data');

        const userDirs = await readdirAsync(baseDir);
        const userFolder = userDirs.find(dir => dir.startsWith(`${userId}_`));

        if (!userFolder) {
            res.status(StatusCodes.NOT_FOUND).json({message: "User folder not found."});
            return;
        }

        const userDir = path.join(baseDir, userFolder);
        const files = await readdirAsync(userDir);
        const datasetFiles = files.filter(f => f.startsWith('import_') && f.endsWith('.json'));

        const datasets = await Promise.all(datasetFiles.map(async (file, index) => {
            const filePath = path.join(userDir, file);
            const content = await readFileAsync(filePath, 'utf-8');
            const parsed = JSON.parse(content);

            const createdAtParts = parsed.meta.created.split('.'); // dd.mm.yyyy
            const modifiedAtParts = parsed.meta.lastModified.split('.');

            const createdAt = new Date(+createdAtParts[2], +createdAtParts[1] - 1, +createdAtParts[0]);
            const lastModified = new Date(+modifiedAtParts[2], +modifiedAtParts[1] - 1, +modifiedAtParts[0]);

            const records = Array.isArray(parsed.data) ? parsed.data : [];
            const previewData = records.slice(0, 5); // kleine Vorschau

            return {
                id: parsed.meta.id,
                name: parsed.meta.datasetName,
                recordCount: records.length,
                createdAt,
                lastModified,
                fileType: 'JSON',
                data: previewData,
                fields: previewData.length > 0 ? Object.keys(previewData[0]) : []
            };
        }));

        res.status(StatusCodes.OK).json({datasets});

    } catch (err: any) {
        console.error('Fehler beim Abrufen der Datasets:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: 'Fehler beim Abrufen der Datasets.',
            details: err.message
        });
    }
};

export const deleteDatasetsFromUser = async (req: RequestWithUser, res: Response) => {
    const userId = req.user?.id;
    const idParam = req.params.fileId;

    if (!userId) {
         res.status(StatusCodes.UNAUTHORIZED).json({message: "Not authenticated"}); return ;
    }

    const fileId = Number(idParam);
    if (Number.isNaN(fileId) || !Number.isInteger(fileId) || fileId < 1) {
        res.status(StatusCodes.BAD_REQUEST).json({error: "Invalid dataset ID"}); return ;
    }

    try {

        // 1. Basisverzeichnis ermitteln (gleich wie in saveUserImport / fetchDatasetsFromUser)
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const baseDir = path.join(__dirname, "..", "..", "..", "user_data");

        // 2. Benutzerordner suchen (z. B. "5_Mustermann_M")
        const userDirs = await readdirAsync(baseDir);
        const userFolder = userDirs.find((dirName) => dirName.startsWith(`${userId}_`));

        if (!userFolder) {
           res.status(StatusCodes.NOT_FOUND).json({message: "User folder not found."}); return ;
        }

        const userDir = path.join(baseDir, userFolder);
        const files = await readdirAsync(userDir);

        const idFromFilename = (filename: string): number | null => {
            const match = filename.match(/_(\d+)\.json$/);
            if (!match) return null;
            return parseInt(match[1], 10);
        };

        const fileToDelete = files.find(f => idFromFilename(f) === fileId)

        if (!fileToDelete) {
         res.status(StatusCodes.NOT_FOUND).json({error: "Dataset not found."}); return ;
        }

        const filePath = path.join(userDir, fileToDelete);
        await unlinkAsync(filePath);

      res.status(StatusCodes.OK).json({message: `Dataset ${fileId} deleted.`}); return ;

    } catch (error) {
        console.error("Error deleting dataset:", error);
   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Failed to delete dataset.",
            details: error.message
        }); return;
    }

}


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