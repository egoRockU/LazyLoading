import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Express + Typescript + idk');
});

app.get('/table', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'pages/table.html'));
});

app.listen(port, ()=>{
    console.log(`[server]: Server is running at http://localhost:${port}`);
});