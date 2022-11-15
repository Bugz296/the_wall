import commentModel from "../models/comment.model";
import messageModel from "../models/message.model";
class CommentsController{

    addComment = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { comment, message_id } = req.body;
            response_data = await commentModel.addComment(comment, req.session.user.id, message_id);

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

    getMessages = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            response_data = await messageModel.getMessages(message, req.session.user.id);
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        res.json(response_data);
    }

    deleteComment = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            await commentModel.deleteComment(req.body.comment_id, req.session.user.id);
            response_data = await messageModel.getMessagesAndComments();
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        res.render('partials/message', {messages: response_data.result, user_data: req.session.user});
    }
}

export default new CommentsController();