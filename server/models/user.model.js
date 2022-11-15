import DatabaseModel from "./lib/database.model";
import { format as mysqlFormat } from "mysql";
class UserModel extends DatabaseModel{
    constructor(){
        super();
    }

    register = async ({ email, password, first_name, last_name }) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let select_query = mysqlFormat(`SELECT * FROM users WHERE email = ?;`, [email]);
            let [user_data] = await this.executeQuery(select_query);

            if(user_data){
                response_data.error = "Email Already Taken.";
            }
            else{
                let insert_query = mysqlFormat(`INSERT INTO users SET ?, created_at = NOW();`, [{ email, password, first_name, last_name }]);
                let { insertId: user_id } = await this.executeQuery(insert_query);
                response_data.status = true;
                response_data.result.user_id = user_id;
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    login = async ({ email, password }) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let select_query = mysqlFormat(`SELECT id, email, first_name, last_name FROM users WHERE email = ? AND password = ?;`, [email, password]);
            let [user_data] = await this.executeQuery(select_query);

            if(user_data){
                response_data.status = true;
                response_data.result = { ...user_data };
            }
            else{
                response_data.error = "Invalid Credentials";
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }
}

export default new UserModel();