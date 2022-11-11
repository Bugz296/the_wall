import mysql from "mysql";
class DatabaseModel{
    constructor(){
        this.connection = mysql.createConnection({
            host: 'localhost',
            database: 'the_wall',
            user: 'root',
            password: ''
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