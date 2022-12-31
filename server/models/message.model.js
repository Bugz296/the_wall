import DatabaseModel from "../../../the_wall/server/models/lib/database.model";
import { format as mysqlFormat } from "mysql";
class UserModel extends DatabaseModel{
    constructor(){
        super();
    }

    getMessages = async (user_id) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let select_query = mysqlFormat(`
                SELECT
                        messages.id AS message_id,
                    CONCAT(messenger.first_name, ' ', messenger.last_name) AS messenger,
                    message,
                    DATE_FORMAT(messages.created_at, "%b %D, %Y") AS 'messaged_at',
                    -- TIMESTAMPDIFF(MINUTE, NOW(), messages.created_at) > 30 AND messages.user_id = ? AS is_msg_archivable,
                    1 AS is_msg_archivable,
                    (
                        SELECT 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'comment_id', comments.id,
                                    'comment', comment,
                                    'commenter', CONCAT(commenter.first_name, ' ', commenter.last_name),
                                    'commented_at', DATE_FORMAT(comments.created_at, "%b %D, %Y"),
                                    'is_cmt_archivable', 1 -- TIMESTAMPDIFF(MINUTE, NOW(), comments.created_at) > 30 AND ? = comments.user_id
                                )
                        ) FROM comments
                        INNER JOIN users commenter ON commenter.id = comments.user_id
                        WHERE comments.message_id = messages.id
                    ) AS comments
                FROM messages
                INNER JOIN users messenger ON messenger.id = messages.user_id
                ORDER BY messages.id DESC;`, [user_id, user_id]);
            response_data.result = await this.executeQuery(select_query);
            response_data.status = true;
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    addMessage = async(user_id, message) => {
        let response_data = { status: false, result: {}, error: null };

        try {

            let insert_query = mysqlFormat(`INSERT INTO messages SET ?, created_at = NOW();`, [{user_id, message}]);
            await this.executeQuery(insert_query);
            response_data.result = await this.getMessages(user_id);
            response_data.status = true;
        }
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    deleteContent = async(user_id, table_name, content_id) => {
        let response_data = { status: false, result: {}, error: null };

        try {
console.log('user_id, table_name, content_id :>> ', user_id, table_name, content_id);
            let delete_query = mysqlFormat(`DELETE FROM ${table_name} WHERE id = ? -- AND TIMESTAMPDIFF(MINUTE, NOW(), created_at) > 30;`, [content_id]);
            await this.executeQuery(delete_query);
console.log('delete_query :>> ', delete_query);
            if(table_name === "messages"){
                delete_query = mysqlFormat(`DELETE FROM comments WHERE message_id = ?;`, [content_id]);
                await this.executeQuery(delete_query);
            }
console.log('comments delete_query :>> ', delete_query);
            response_data.result = await this.getMessages(user_id);
            response_data.status = true;
        }
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }
}

export default new UserModel();