import DatabaseModel from "./lib/database.model";
import {format as mysqlFormat} from "mysql";

class MessageModel extends DatabaseModel{

    constructor(){
        super();
    }

    addMessage = async(message, user_id) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let insert_query = mysqlFormat(`INSERT INTO messages SET message = ?, user_id = ?, created_at = NOW();`, [message, user_id]);
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

    getMessagesAndComments = async() => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let select_query = mysqlFormat(`
                SELECT
                    messages.id AS message_id,
                    message,
                    messages.created_at AS msg_created_at,
                    CONCAT(msg_users.first_name, ' ', msg_users.last_name) AS 'msg_author',
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'comment_id', comments.id,
                                'comment', comment,
                                'created_at', comments.created_at,
                                'cmts_author', CONCAT(msg_users.first_name, ' ', msg_users.last_name)
                                )
                        ) FROM comments
                        INNER JOIN users AS cmts_users ON cmts_users.id = comments.user_id WHERE comments.message_id = messages.id
                        ORDER BY comments.id DESC
                    ) AS comments_json
                FROM the_wall.messages
                INNER JOIN users AS msg_users ON msg_users.id = messages.user_id
                ORDER BY messages.id DESC;`);
            response_data.result = await this.executeQuery(select_query);

            if(response_data.result.length > 0){
                response_data.status = true;
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    deleteMessage = async(message_id, user_id) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let delete_query = mysqlFormat(`DELETE FROM messages WHERE id = ? AND user_id = ? AND TIMESTAMPDIFF(minute, created_at, NOW()) > 30;`, [message_id, user_id]);
            let delete_result = await this.executeQuery(delete_query);

            if(delete_result.affectedRows){

                let select_query = mysqlFormat(`SELECT JSON_ARRAYAGG(id) AS comment_ids_to_delete_json FROM comments WHERE message_id = ? AND user_id = ?;`, [message_id, user_id]);
                let [result] = await this.executeQuery(select_query);

                let comment_ids_to_delete_array = result.comment_ids_to_delete_json ? JSON.parse(result.comment_ids_to_delete_json) : [];

                if(comment_ids_to_delete_array.length){

                    delete_query = mysqlFormat(`DELETE FROM comments WHERE message_id = ? AND user_id = ?`, [message_id, user_id]);
                    await this.executeQuery(delete_query);
                }

                response_data.status = true;
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }
}

export default new MessageModel();