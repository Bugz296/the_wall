import DatabaseModel from "./lib/database.model";
import {format as mysqlFormat} from "mysql";

class CommentModel extends DatabaseModel{

    constructor(){
        super();
    }

    addComment = async(comment, user_id, message_id) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let insert_query = mysqlFormat(`INSERT INTO comments SET comment = ?, user_id = ?, message_id = ?, created_at = NOW();`, [comment, user_id, message_id]);
            response_data.result = await this.executeQuery(insert_query);

            if(response_data.result?.insertId){
                response_data.status = true;
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    deleteComment = async(comment_id, user_id) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let delete_query = mysqlFormat(`DELETE FROM comments WHERE id = ? AND user_id = ? AND TIMESTAMPDIFF(minute, created_at, NOW()) > 30;`, [comment_id, user_id]);
            let delete_result = await this.executeQuery(delete_query);
            response_data.status = delete_result.affectedRows > 0;
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }
}

export default new CommentModel();