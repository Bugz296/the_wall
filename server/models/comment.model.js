import DatabaseModel from "../../../the_wall/server/models/lib/database.model";
import messageModel from "./message.model";

import { format as mysqlFormat } from "mysql";
class UserModel extends DatabaseModel{
    constructor(){
        super();
    }

    addComment = async(user_id, comment, message_id) => {
        let response_data = { status: false, result: {}, error: null };

        try {

            let insert_query = mysqlFormat(`INSERT INTO comments SET ?, created_at = NOW();`, [{user_id, comment, message_id}]);
            await this.executeQuery(insert_query);
            response_data.result = await messageModel.getMessages(user_id);
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