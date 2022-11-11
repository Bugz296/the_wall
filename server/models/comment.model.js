import DatabaseModel from "./lib/database.model";
import messageModel from "./message.model";
import { format as mysqlFormat } from "mysql";
class CommentModel extends DatabaseModel{
    constructor(){
        super();
    }

    addComment = async ({ comment, message_id, user_id }) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            /* */
            let insert_query = mysqlFormat(`INSERT INTO comments SET ?, created_at = NOW();`, [{ comment, message_id, user_id }]);
            await this.executeQuery(insert_query);

            response_data = await messageModel.getMessagesAndComments();
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    deleteComment = async ({ comment_id, message_id, user_id }, is_delete_comments_by_message_id = false) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let delete_query = `DELETE FROM comments WHERE `;
            if(is_delete_comments_by_message_id){
                delete_query += mysqlFormat(`message_id = ?`, [parseInt(message_id)]);
            }
            else{
                delete_query += mysqlFormat(`id = ? AND user_id = ? AND message_id = ? AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 30`, [ parseInt(comment_id), user_id, parseInt(message_id) ]);
            }

            await this.executeQuery(delete_query);

            response_data = await messageModel.getMessagesAndComments();
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    fetchComments = async ({ message_id }, fields_to_select = "*") => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let select_query = mysqlFormat(`
                SELECT ${fields_to_select} FROM comments WHERE message_id in (?);`, [ message_id]);
            let comments = await this.executeQuery(select_query);

            if(comments?.length){
                response_data.status = true;
                response_data.result = comments;
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }
}

export default new CommentModel();