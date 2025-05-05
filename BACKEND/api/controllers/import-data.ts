import {StatusCodes} from 'http-status-codes';
import {Request, Response} from 'express';
import axios from "axios";
import csv from "csvtojson";

// todo
// url -> done
// json + csv
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

const importFromSQL = async (req: Request, res: Response) => {

}
