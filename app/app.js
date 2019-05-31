/**
 * Imports
 */
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

/**
 * Initializations
 */
const app = express();
require('./config/database');
require('./config/passport');
//Socket.io
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
module.exports = io;

/**
 * Settings
 */
app.use(express.static(__dirname + "/public"));

/*app.set('view engine', '.hbs');*/

/**
 * Middlewares
 */
//Understand data from forms and false because I only want data
app.use(express.urlencoded({extended: false})); 
app.use(methodOverride('_method')); //
app.use(session({ //Save users data through a session
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 * Global Variables
 */
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

/**
 * Routes - Controllers 
 */
app.use(require('./routes'));
app.use(require('./routes/users'));
app.use(require('./routes/maps'));

/**
 * Static Files
 */
app.use(express.static(path.join(__dirname, 'public')));

// Server is listening
http.listen(3000); //Is http for Socket