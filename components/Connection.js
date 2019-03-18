import mysql from "mysql";
import fs from "fs";

export default class Database {
    constructor() {
        if (fs.existsSync('../config/dbProd.json')) {
            this.connection = mysql.createConnection(require('../config/dbProd.json'));
        } else {
            this.connection = mysql.createConnection(require('../config/db.json'));
        }
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

