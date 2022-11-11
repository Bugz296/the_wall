import DatabaseModel from "./lib/database.model";
import commentModel from "./comment.model";
import { format as mysqlFormat } from "mysql";
class MessageModel extends DatabaseModel{
    constructor(){
        super();
    }

    addMessage = async ({ message, user_id }) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            /* */
            let insert_query = mysqlFormat(`INSERT INTO messages SET ?, created_at = NOW();`, [{ message, user_id }]);
            let { insertId } = await this.executeQuery(insert_query);

            if(insertId){
                response_data = await this.getMessagesAndComments();
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    deleteMessage = async ({ message_id, user_id }) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            await commentModel.deleteComment({ message_id }, true);

            let delete_query = mysqlFormat(`
                DELETE FROM messages
                WHERE id = ?
                    AND user_id = ?
                    AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 30;`, [ parseInt(message_id), user_id ]);
            await this.executeQuery(delete_query);

            response_data = await this.getMessagesAndComments();
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    getMessagesAndComments = async () => {
        let response_data = { status: false, result: {}, error: null };

        try {
            /* */
            let select_query = mysqlFormat(`
                SELECT
                    messages.id AS message_id,
                    message,
                    DATE_FORMAT(messages.created_at, '%M %D %Y') AS msg_created_at,
                    CONCAT(first_name, " ", last_name) AS messenger,
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'comment_id', comments.id,
                                'comment', comment,
                                'commenter', CONCAT(first_name, " ", last_name),
                                'comment_created_at', DATE_FORMAT(comments.created_at, '%M %D %Y')
                            )
                        )
                        FROM comments
                        INNER JOIN users ON users.id = comments.user_id
                        WHERE comments.message_id = messages.id
                        ORDER BY comments.created_at DESC
                    ) AS comments
                FROM messages
                INNER JOIN users ON users.id = messages.user_id
                ORDER BY messages.created_at DESC;`);
            let comments_and_messages = await this.executeQuery(select_query);

            if(comments_and_messages?.length){
                response_data.status = true;
                response_data.result = comments_and_messages;
            }
            else{
                response_data.error = "Failed to fetch messages and comments.";
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