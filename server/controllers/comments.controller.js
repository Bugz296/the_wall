import messageModel from "../models/comment.model";

class CommentsController{

    addComment = async (req, res, next) => {

        let response_data = { status: false, result: {}, error: null };

        try {
            response_data = await messageModel.addComment(req.session.user.id, req.body.comment, req.body.message_id);
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.render('home', response_data);
    }
}

export default new CommentsController();