import userModel from "../models/user.model";
import messageModel from "../models/message.model";
import { createSession, destroySession } from "../helpers/session.helper";

class UsersController{

    register = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { email, password, first_name, last_name } = req.body;
            response_data = await userModel.register({ email, password, first_name, last_name });

            if(response_data){
                createSession(req, { email, first_name, last_name, id: response_data.result.user_id });
            }
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.json(response_data);
    }

    login = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            let { password, email } = req.body;
            response_data = await userModel.login({ password, email });

            if(response_data){
                createSession(req, response_data.result);
                response_data.result = {};
            }
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.json(response_data);
    }

    logout = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {
            destroySession(req);
            response_data.status = true;
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.redirect('/');
    }

    getHomeData = async (req, res, next) => {
        let response_data = { status: false, result: {}, error: null };

        try {

            response_data = await messageModel.getMessagesAndComments();
        }
        catch(error){
            console.log(error);
            response_data.status = false;
            response_data.error = error;
        }

        res.render('home', { data: response_data.result, user: req.session.user });
    }
}

export default new UsersController();