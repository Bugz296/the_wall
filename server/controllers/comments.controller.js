import commentModel from "../models/comment.model";

class CommentsController{

    addComment = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { comment, message_id } = req.body;
            response_data = await commentModel.addComment({ comment, message_id, user_id: req.session.user.id });
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.json(response_data);
    }

    deleteComment = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { comment_id, message_id } = req.body;
            response_data = await commentModel.deleteComment({ comment_id, message_id, user_id: req.session.user.id });
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.json(response_data);
    }
}

export default new CommentsController();