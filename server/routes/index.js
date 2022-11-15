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

router.get('/home', messagesController.getMessagesAndComments);

router.post('/register', ValidationsMiddleware.register, usersController.register);

router.post('/login', ValidationsMiddleware.login, usersController.login);

router.get('/logout', usersController.logout);

router.post('/add_message', messagesController.addMessage);
router.post('/add_comment', commentsController.addComment);
router.post('/delete_message', messagesController.deleteMessage);
router.post('/delete_comment', commentsController.deleteComment);

module.exports = router;