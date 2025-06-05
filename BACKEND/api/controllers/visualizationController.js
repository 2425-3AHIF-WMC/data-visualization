import { StatusCodes } from 'http-status-codes';
import { pool } from "../../config/db";
export const postVisualization = async (req, res) => {
    const { type, title, library, width, height, data, xaxis, yaxis, aggregation, filters, interactions } = req.body;
    console.log('[postVisualization] Request body:', {
        type,
        title,
        library,
        width,
        height,
        /** Achtung: data kann sehr groß sein, ggf. nur Länge loggen */
        dataLength: Array.isArray(data) ? data.length : null,
        xaxis,
        yaxis,
        aggregation,
        filters,
        interactions
    });
    if (!type || !title || !library || !width || !height || !data) {
        console.warn('[postVisualization] Fehlende Felder erkannt');
        res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: 'Missing required fields' });
        return;
    }
    const owner = req.user.id;
    console.log(`[postVisualization] Authentifizierter Benutzer: ${owner}`);
    try {
        const sql = `
      INSERT INTO visualizations 
        (owner, type, title, library, width, height, data, xaxis, yaxis, aggregation, filters, interactions)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11::jsonb, $12::jsonb)
      RETURNING id
    `;
        const values = [
            owner,
            type,
            title,
            library,
            width,
            height,
            JSON.stringify(data),
            xaxis || null,
            yaxis || null,
            aggregation || null,
            JSON.stringify(filters || []),
            JSON.stringify(interactions || [])
        ];
        console.log('[postVisualization] Auszuführende SQL-Abfrage:', sql);
        console.log('[postVisualization] Mit Werten:', values);
        const result = await pool.query(sql, values);
        if (result.rows.length === 0) {
            console.error('[postVisualization] INSERT hat keine ID zurückgegeben');
            res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: 'Failed to retrieve new visualization ID' });
            return;
        }
        const newVisualizationId = result.rows[0].id;
        console.log(`[postVisualization] Neue Visualization-ID: ${newVisualizationId}`);
        res.status(StatusCodes.CREATED).json({ id: newVisualizationId });
    }
    catch (error) {
        console.error('[postVisualization] Fehler beim Erstellen der Visualization:', error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Failed to create visualization' });
        return;
    }
};
export const getVisualizations = async (req, res) => {
    const owner = req.user.id;
    console.log(`[getVisualizations] Anforderung von Benutzer: ${owner}`);
    try {
        const sql = 'SELECT * FROM visualizations WHERE owner = $1';
        console.log('[getVisualizations] Auszuführende SQL-Abfrage:', sql, 'mit owner=', owner);
        const result = await pool.query(sql, [owner]);
        console.log(`[getVisualizations] Gefundene Zeilen: ${result.rows.length}`);
        res.status(StatusCodes.OK).json(result.rows);
    }
    catch (error) {
        console.error('[getVisualizations] Fehler beim Laden der Visualizations:', error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Failed to fetch visualizations' });
        return;
    }
};
export const deleteVisualization = async (req, res) => {
    const { id } = req.params;
    const owner = req.user.id;
    console.log(`[deleteVisualization] Versuch, Visualization ${id} für Benutzer ${owner} zu löschen`);
    try {
        const sql = 'DELETE FROM visualizations WHERE id = $1 AND owner = $2';
        console.log('[deleteVisualization] Auszuführende SQL-Abfrage:', sql, 'mit id=', id, 'owner=', owner);
        const result = await pool.query(sql, [id, owner]);
        console.log(`[deleteVisualization] Betroffene Zeilen: ${result.rowCount}`);
        if (result.rowCount === 0) {
            console.warn(`[deleteVisualization] Keine Visualization gefunden oder nicht im Besitz von ${owner}`);
            res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'Visualization not found or not owned by user' });
            return;
        }
        console.log(`[deleteVisualization] Successfully deleted visualization with ID ${id}`);
        res.status(StatusCodes.NO_CONTENT).send();
    }
    catch (error) {
        console.error('[deleteVisualization] Fehler beim Löschen der Visualization:', error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Failed to delete visualization' });
        return;
    }
};
export const getVisualizationsById = async (req, res) => {
    const { id } = req.params;
    const owner = req.user.id;
    console.log(`[getVisualizationsById] Anforderung für Visualization ${id} von Benutzer ${owner}`);
    try {
        const sql = 'SELECT * FROM visualizations WHERE id = $1 AND owner = $2';
        console.log('[getVisualizationsById] Auszuführende SQL-Abfrage:', sql, 'mit id=', id, 'owner=', owner);
        const result = await pool.query(sql, [id, owner]);
        console.log(`[getVisualizationsById] Gefundene Zeilen: ${result.rows.length}`);
        if (result.rows.length === 0) {
            console.warn(`[getVisualizationsById] Visualization ${id} nicht gefunden oder nicht im Besitz von ${owner}`);
            res
                .status(StatusCodes.NOT_FOUND)
                .json({ error: 'Visualization not found or not owned by user' });
            return;
        }
        console.log(`[getVisualizationsById] Rückgabe der Visualization-Daten für ID ${id}`);
        res.status(StatusCodes.OK).json(result.rows[0]);
    }
    catch (error) {
        console.error('[getVisualizationsById] Fehler beim Abrufen der Visualization:', error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Failed to fetch visualization' });
        return;
    }
};
export const getVisualizationsCount = async (req, res) => {
    const owner = req.user.id;
    console.log(`[getVisualizationsCount] Zähle Visualizations für Benutzer ${owner}`);
    try {
        const sql = 'SELECT COUNT(*) AS count FROM visualizations WHERE owner = $1';
        console.log('[getVisualizationsCount] Auszuführende SQL-Abfrage:', sql, 'mit owner=', owner);
        const result = await pool.query(sql, [owner]);
        const count = parseInt(result.rows[0].count, 10);
        console.log(`[getVisualizationsCount] Gefundene Visualizations: ${count}`);
        res.status(StatusCodes.OK).json({ count });
    }
    catch (error) {
        console.error('[getVisualizationsCount] Fehler beim Zählen der Visualizations:', error);
        res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Failed to count visualizations' });
        return;
    }
};
