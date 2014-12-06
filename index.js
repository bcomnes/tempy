var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var passport = require('passport');
var bodyParser = require('body-parser');
var NestStrategy = require('passport-nest').Strategy;
var Firebase = require('firebase');
var fs = require('fs');
var browserify = require('browserify-middleware');
var tempLog = require('./lib/tempLog');

if (fs.existsSync('./local.json')) {
    var local = require('./local')
};


var routes = require('./routes/index');

var app = express();

var token;

passport.use(new NestStrategy({
    clientID: process.env.NEST_ID || local.nestID,
    clientSecret: process.env.NEST_SECRET || local.nestSecret
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser(process.env.COOKIE_SECRET || local.cookieSecret));
app.use(session({
    secret: process.env.SESSION_SECRET || local.cookieSecret
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(tempLog);
app.use('/js', browserify('./client'));

app.use('/', routes);

app.get('/auth/nest', passport.authenticate('nest'));
app.get('/auth/nest/callback',
    passport.authenticate('nest', {}),
    function(req, res) {
        // Figure out where to store it.
        token = req.user.accessToken
        console.log('token: ' + token);
        res.redirect('/');
    }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
