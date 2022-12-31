import mysql from "mysql";
class DatabaseModel{
    constructor(){
        this.connection = mysql.createConnection({
            host: '172.26.0.1',
            database: 'the_wall',
            user: 'root',
            password: 'password',
            port: 3306,
            connectTimeout: 10000,
            charset: 'utf8mb4'
        })
    }

    executeQuery = (query) => {
        return new Promise((resolve, reject) => {
            this.connection.query(query, (error, rows) => {
                return error ? reject(error) : resolve(rows);
            });
        });
    }
}

export default DatabaseModel;