require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var unirest = require('unirest');
var plainText = 'everything is awesome';

var app = express();


app.set('trust proxy', 1);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SECRET1, process.env.SECRET2],
    secure: false
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(cookieSession({
//    secret: process.env.SECRET,
//    resave: false,
//    saveUninitialized: true,
//    cookie: { secure: false }
//}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user)
});

passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.HOST + "/auth/twitter/callback",
        state: true
    },
    function(token, tokenSecret, profile, done) {
        process.nextTick(function () {
            // To keep the example simple, the user's Twitter profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Twitter account with a user record in your database,
            // and return that user instead.
            return done(null, {id: profile.id, displayName: profile.displayName});
        });
    }
));

app.get('/auth/twitter',
    passport.authenticate('twitter'),
    function(req, res){
    });

app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.use(function (req, res, next) {
    res.locals.user = req.user;
    next()
});

app.get('/journal', function(req, res) {
    unirest.get('https://api.dandelion.eu/datatxt/sent/v1/?lang=en&text=' + plainText + '&$app_id='
        + process.env.DANDELION_API_ID + '&$app_key=' + process.env.DANDELION_API_KEY)
        .end(function (response) {
            console.log(response.body);
        });
    res.end();
});

app.use('/', routes);
app.use('/users', users);

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
