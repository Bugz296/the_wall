const PORT = 3000;
const SESSION_SECRET_KEY = "thisismysessionsecretkey";
const MAX_AGE_SESSION = 86400000;

import { checkSession } from './middlewares/sessions.middleware'; 

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var memoryStore = require('memorystore')(sessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/../public')));

/* Session */
app.use(sessions({
    secret: SESSION_SECRET_KEY,
    saveUninitialized: true,
    store: new memoryStore({checkPeriod: MAX_AGE_SESSION}),
    cookie: { path: '/', maxAge: MAX_AGE_SESSION },
    resave: false
}));

app.use('/jquery', express.static(__dirname + '/../node_modules/jquery/dist/'));

app.use(checkSession());

var indexRouter = require('./routes/index');
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(PORT, () => { console.log("Listening to port:", PORT )});

module.exports = app;
