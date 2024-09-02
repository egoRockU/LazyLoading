import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { con, runQuery } from "./db/dbconfig";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + Typescript + idk');
});

app.get('/table', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'pages/table.html'));
});


app.get('/getEmployees', async (req: Request, res: Response) => {
    const start = parseInt(req.query.start as string, 10) || 0;
    const length = parseInt(req.query.length as string, 10) || 10;
    let search = '';

    if (req.query.search && typeof req.query.search === 'object' && 'value' in req.query.search) {
        // Additional check to ensure `req.query.search.value` is a string
        const searchValue = (req.query.search as Record<string, any>).value;
        search = typeof searchValue === 'string' ? searchValue : '';
    }

    const sortColumn = req.query.sortColumn;
    const sortDirection = req.query.sortDirection == 'asc' ? 'desc' : 'asc';

    const selCount = `SELECT COUNT(ID) as count FROM Employees`;
    const selCountResult: any = await runQuery(selCount); 

    //const searchConditions = `compCode LIKE ? OR empId LIKE ? OR activity LIKE ? OR date LIKE ? OR time LIKE ? AND remarks LIKE ?`
    const searchConditions = `CompCode LIKE ? OR EmpID LIKE ? OR Activity LIKE ? OR Date LIKE ? OR Time LIKE ?`

    const queryCountFiltered = `SELECT COUNT(ID) AS count FROM Employees WHERE (${searchConditions})`;
    //const queryCountFilteredResult: any  = await con.all(queryCountFiltered, [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]); 
    const queryCountFilteredResult: any  = await runQuery(queryCountFiltered);

    const fetchData = `SELECT ID, CompCode, EmpID, Activity, Date, Time FROM Employees WHERE (${searchConditions}) ORDER BY ${sortColumn} ${sortDirection} LIMIT ? OFFSET ?`;
    // const fetchDataResult = await con.all(fetchData, [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, length, start]);
    const fetchDataResult = await runQuery(fetchData);

    return res.json({
        //draw: req.body.draw,
        recordsTotal: selCountResult[0].count,
        recordsFiltered: queryCountFilteredResult[0].count,
        data: fetchDataResult
    });
});


app.listen(port, ()=>{
    console.log(`[server]: Server is running at http://localhost:${port}`);
});