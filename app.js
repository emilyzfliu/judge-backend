var express = require('express');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var GithubStrategy = require('passport-github').Strategy;
var passport = require('passport');
var CN = require('cn-utils');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/' + env);
var oauth = require('./config/oauth');

var User = require('./models/user');

require('colors');

var app = express();

// passport setup
passport.use(new GithubStrategy(oauth.github,
  function (accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }));

// serialize and deserialize
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

mongoose.connect(config.db.url);
app.db = mongoose.connection;

app.use(cors({
  origin: true,
  credentials: true
}));

app.db.on('open', function () {
  console.log('connected to db'.yellow);
});

app.use(logger('dev'));
app.use(bodyParser.json());

app.use(passport.initialize());

CN.configPassport(passport, User, config);
require('./routes/auth-jwt')(app, User, config.secret, '/auth/jwt');
require('./routes/users')(app, '/users');
require('./routes/problems')(app, '/problems');
require('./routes/submissions')(app, '/submissions');
require('./routes/contests')(app, '/contests');
require('./routes/auth')(app, '/auth', passport);

// / catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  res.status(404).json({ok: 'false', error: 'not found'});
});

module.exports = app;
