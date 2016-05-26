//Getting the packages needed to add functionality to the web app

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require ('fs');
//var files = require('./routes/index.js');
//var upload = multer({ dest: './uploads' });
var routes = require('./routes/index');
//var users = require('./routes/users');
/*var app = require('express')(),
mailer = require('express-mailer');*/

//var files = require('./routes/index');

//require monk and mongo and mongoClient to create a db and a connection to it
var mongo = require('mongodb');
var monk = require('monk');
//var db = monk('mongodb://dbuserclaire:litclonmel@ds030719.mlab.com:30719/portfoliodb');
var mongoClient = require('mongodb').MongoClient;
var db = monk('mongodb://localhost:27017/portfoliodb');
// If I am running locally then use 'mongodb://localhost:27017/test' otherwise
// look for the environment variable
var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://clairelit:irisheyes@ds030719.mlab.com:30719/portfoliodb';
//var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://localhost:27017/portfoliodb';

//Checking for connection with the db
mongoClient.connect(url, function(err, conn) {
        if(err){
            console.log(err.message);
            throw err;
        } else {
            console.log("Connected to DB");
            conn.close();
        }
});

/*mailer.extend(app, {
  from: 'no-reply@example.com',
  host: 'smtp.gmail.com', // hostname 
  secureConnection: true, // use SSL 
  port: 465, // port for secure SMTP 
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
  auth: {
    user: 'gmail.user@gmail.com',
    pass: 'userpass'
  }
});*/

/*
 * Requiring the following package to be able to use sessions.
 * Need sessions to be able to store user details
 */
var session = require('express-session');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Including this to get sessions to work
var expressSessionOptions = {
  secret:'mySecret',
  resave: true,
  saveUninitialized: true
}

//session middleware - has to be used
app.use(session(expressSessionOptions));

/*app.use(multer({
  dest: path.join(__dirname, 'public/upload/temp')
}).any());

var multerOptions={
    dest:'./public/uploads/',
    rename: function(fieldname, filename){
        return filename+"_"+Date.now();
    }    
}
    
app.use('/file/', multer(multerOptions));*/

//This variable and its method is to specify where files will be stored
//(ie - in which folder). 
var storageMethod = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("In destination");
        cb(null, './public/uploads/');
    },
    ///assigns a new filename to each file using the currenct date and time.
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});



//Middleware to tell the app to use multer, and what storage method
app.use('/file/',multer({storage: storageMethod}).any());
var upload = multer({ storageMethod: storageMethod});


//This makes the database accessible to the router
app.use(function(req, res, next){
  req.db=db;
  next();
});


app.use('/', routes);
app.use('/file/', routes);

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

//I have included this line so that when I inspect the element
//online, because I find it difficult to read it when it's not prettyfied
app.locals.pretty = true;

module.exports = app;
