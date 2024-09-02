import sqlite3 from 'sqlite3';
import { promisify } from 'util';

const con = new sqlite3.Database('Employees.db', (err: Error | null) => {
    if (err){
        console.error('Error opening database: ', err);
    } else {
        console.log('Connected to the SQLite Database.');
    };
});

const runQuery = promisify(con.all.bind(con))
// con.all = promisify(con.all.bind(con))

export { con, runQuery };