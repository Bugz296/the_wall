import ValidationsMiddleware from "../middlewares/validations.middleware";
import usersController from "../controllers/users.controller";
import messagesController from "../controllers/messages.controller";
import commentsController from "../controllers/comments.controller";

var express = require('express');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

/* GET home page. */
router.get('/home', messagesController.getMessages);

router.post('/add_message', messagesController.addMessage);

router.post('/add_comment', commentsController.addComment);

router.post('/delete_content', messagesController.deleteContent)

router.post('/register', ValidationsMiddleware.register, usersController.register);

router.post('/login', ValidationsMiddleware.login, usersController.login);

router.get('/logout', usersController.logout);

module.exports = router;