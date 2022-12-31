import messageModel from "../models/message.model";

class MessagesController{
    getMessages = async (req, res, next) => {

        let response_data = { status: false, result: {}, error: null };

        try {
            response_data = await messageModel.getMessages(req.session.user.id);
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.render('home', response_data);
    }

    addMessage = async (req, res, next) => {

        let response_data = { status: false, result: {}, error: null };

        try {

            response_data = await messageModel.addMessage(req.session.user.id, req.body.message);
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.render('home', response_data);
    }

    deleteContent = async (req, res, next) => {

        let response_data = { status: false, result: {}, error: null };
console.log('req.body :>> ', req.body);
        try {
            response_data = await messageModel.deleteContent(req.session.user.id, req.body.is_message ? "messages" : "comments", req.body.content_id);
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.render('home', response_data);
    }
}

export default new MessagesController();