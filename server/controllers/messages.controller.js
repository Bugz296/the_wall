import messageModel from "../models/message.model";

class MessagesController{

    addMessage = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { message } = req.body;
            response_data = await messageModel.addMessage({ message, user_id: req.session.user.id });
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.json(response_data);
    }

    deleteMessage = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { message_id } = req.body;
            response_data = await messageModel.deleteMessage({ message_id, user_id: req.session.user.id });
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.json(response_data);
    }
}

export default new MessagesController();