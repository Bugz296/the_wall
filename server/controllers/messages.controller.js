import messageModel from "../models/message.model";
class MessagesController{

    addMessage = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { message } = req.body;
            response_data = await messageModel.addMessage(message, req.session.user.id);

            if(response_data.status){
                response_data = await messageModel.getMessagesAndComments();
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        res.render('partials/message', {messages: response_data.result, user_data: req.session.user});
    }

    getMessagesAndComments = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            response_data = await messageModel.getMessagesAndComments();
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        res.render('home', {messages: response_data.result, user_data: req.session.user});
    }

    deleteMessage = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            await messageModel.deleteMessage(req.body.message_id, req.session.user.id);
            response_data = await messageModel.getMessagesAndComments();
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        res.render('partials/message', {messages: response_data.result, user_data: req.session.user});
    }
}

export default new MessagesController();