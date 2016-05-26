//Requiring all the packages needed for the app to run

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var files = new Array();

//Requiring mongoDB and mongoClient so I can create a database
//and establish a connection with it 
var mongoClient = require('mongodb').MongoClient;
var monk = require('monk');
/*var app = require('express')(),
mailer = require('express-mailer');*/
var multer = require('multer');
var upload = multer();
//var upload = multer({ dest: './uploads' });


//Setting up variables so that the database will either run locally
//or use a set of environment variable to run online
var db = monk('mongodb://localhost:27017/portfoliodb');

var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://clairelit:irisheyes@ds030719.mlab.com:30719/portfoliodb';
//var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://localhost:27017/portfoliodb';


/*router.get('/delete', function(req, res, next){
  var db=req.db;
  var collection=db.get('userTable');
  
  collection.remove({firstname: 'Mark'});
  
  res.send('That Worked');
});*/

//If user enters an invalid username(ie - if it is not in the db),
//the invalid page will be rendered
router.get('/invalidusername', function(req, res, next){
  res.render('invalidusername');
});

/* If a user is tring to register, the following code will be executed.
The person registering is required to enter in all the details in the form, which
will then be stored in a database. */
router.post('/register', function(req, res, next) {
var db = req.db;

var enteredUsername = req.body.username;
var collection = db.get('userTable');

collection.find({
        username: enteredUsername
    }, function(e, docs) {
      if (e) throw e;
      else
          if (docs.length>=1) {
              res.redirect('/invalidusername#about');
          } else{
            var firstname = req.body.firstname;
            var surname = req.body.surname;
            var username = req.body.username;
            var email = req.body.email;
            var password = req.body.password;
            var confirm = req.body.confirm;

            collection.insert({
                    "firstname": firstname,
                    "surname": surname,
                    "username": username,
                    "email": email,
                    "password": password,
                    "confirm": confirm
                }, function(err, doc) {
                    if (err) {
                        res.send("Problem adding info to the Database");
                        console.log(err.message);
                    } else{
                    req.session.username = username;
                    console.log(req.session.username);
                    res.redirect('/dashboard');
                    };
                });};
            });
    
    });


//First Name Edit
//If the user wants to change/edit their details, it can be done via the form
//in the dashboard page.  The following code retrieves the data already stored,
//and updates the database with the new data.
//The user will be allowed to change some details, but not their username, as this is
//the main thing I'm using to identify the user.  Each username must be unique.
router.get('/editFirstNameFromDashboard', function(req, res, next){
  
  var currentUser = req.session.username;
  var newFirstName = req.query.firstname;
  var db = req.db;
  var collection = db.get('userTable');
  collection.findAndModify({username: currentUser}, {$set: {firstname: newFirstName}}), function(){
            console.log("Successful Update");  
  };
  res.redirect('/dashboard');
});


//Surname Edit
router.get('/editSurnameFromDashboard', function(req, res, next){
  
  var currentUser = req.session.username;
  var newSurName = req.query.surname;
  var db = req.db;
  var collection = db.get('userTable');
  collection.findAndModify({username: currentUser}, {$set: {surname: newSurName}}), function(){
            console.log("Successful Update");  
  };
  res.redirect('/dashboard');
});


//Email Edit
router.get('/editEmailFromDashboard', function(req, res, next){
  var currentUser = req.session.username;
  var newEmail = req.query.email;
  var db = req.db;
  var collection = db.get('userTable');
  collection.findAndModify({username: currentUser}, {$set: {email: newEmail}}), function(){
            console.log("Successful Update");  
  };
  res.redirect('/dashboard');
});


//Phone Number Edit
router.get('/editPhoneNumberFromDashboard', function(req, res, next){
  
  var currentUser = req.session.username;
  var newPhoneNumber = req.query.phonenumber;
  var db = req.db;
  var collection = db.get('userTable');
  collection.findAndModify({username: currentUser}, {$set: {phonenumber: newPhoneNumber}}), function(){
            console.log("Successful Update");  
  };
  res.redirect('/dashboard');
});

//Twitter Handle Edit
router.get('/editTwitterFromDashboard', function(req, res, next){
  
  var currentUser = req.session.username;
  var newTwitter = req.query.twitter;
  var db = req.db;
  var collection = db.get('userTable');
  collection.findAndModify({username: currentUser}, {$set: {twitter: newTwitter}}), function(){
            console.log("Successful Update");  
  };
  res.redirect('/dashboard');
});



//New Linkedin Details
router.get('/editLinkedinFromDashboard', function(req, res, next){
  
  var currentUser = req.session.username;
  var newLinkedIn = req.query.linkedin;
  var db = req.db;
  var collection = db.get('userTable');
  collection.findAndModify({username: currentUser}, {$set: {linkedin: newLinkedIn}}), function(){
            console.log("Successful Update");  
  };
  res.redirect('/dashboard');
});


//Biography Edit
router.get('/editBioFromDashboard', function(req, res, next){
  
  var currentUser = req.session.username;
  var newBio = req.query.bio;
  var db = req.db;
  var collection = db.get('userTable');
  collection.findAndModify({username: currentUser}, {$set: {bio: newBio}}), function(){
            console.log("Successful Update");  
  };
  res.redirect('/dashboard');
}); 



//Checking if a user exists in the db. and checking if the 
//username and password match the db stored entry.
//If any of the details are incorrect the user is redirected to the wronglogin page.
router.post('/login', function(req, res, next){
  
  var enteredUserName = req.body.username;
  console.log("I got into the route");
  var enteredPassword = req.body.password;
  
  var db = req.db;
  
  var collection = db.get('userTable');
    
  var userDetails = collection.find({username: enteredUserName},function(err, docs){
    
      if(docs.length == 0){
        console.log('No Documents');
        res.redirect('/wronglogin#about');
      }
      else{
        console.log("Login successful");
        console.log(docs.length);
      }
    
      for(var i in docs){
      if(docs[i].password == enteredPassword){
        var username = req.body.username;
        req.session.username = username;
        res.redirect('/dashboard');
      }
      else{
        res.redirect('/wronglogin#about');
      }
    }
    
});
});

//Getting the wronglogin page.
router.get('/wronglogin', function(req, res, next){
  res.render('wronglogin');
});

//If there's a get request for the profile page, it checks if the user is logged in
//IF there is a user logged in, they are brought to their own profile page.
router.get('/profilepage', function (req, res, next) {
  var loggedInUser = req.session.username;
  var db=req.db;
  var collection=db.get('userTable');
  var personDetails = collection.find({ username: loggedInUser }, function (err, doc) {
    if (err) throw err;
    else{
      res.render('profilepage', {userDetails: doc});
      console.log(doc);
    }
});  
});

//When the user clickss the logout button, the session is destroyed and they are brought
//back to the homepage.
router.get('/logout', function(req, res, next){
  req.session.destroy(function(err) {
  res.redirect('/homepage');
});
});

router.get('/homepage', function(req, res, next){
  res.render('homepage');
});


//This checks if there is a session in progress, and if the username is recognised
//If it's not, the homepage will be rendered, otherwise the profile page will be rendered
router.get('/', function(req, res, next){

   if(req.session.username === "undefined" || req.session.username == null){
    res.render('homepage');
  }
  else{
    res.redirect("/profilepage");
  }
});

/*router.get('/welcome', function(req, res, next){
  res.render('welcome');
});*/


//If a user correctly logs in, they will be brought to their personal dashboard, 
router.get('/dashboard', function(req, res, next){
  if(req.session.username === "undefined" || req.session.username == null){
    res.redirect('/homepage#about');
  }else{
  var loggedInUser = req.session.username;
  var db=req.db;
  var collection=db.get('userTable');
  var personDetails = collection.find({ username: loggedInUser }, function (err, doc) {
    if (err) throw err;
    else{
      res.render('dashboard', {userDetails: doc});
      console.log(doc);
    }
});
} 
});

//Not working right now, but here I am trying to set up that when a 
//person views a profile page, they can click on the email address and send
//and email from there.

/*app.get('/profilepage', function (req, res, next) {
  app.mailer.send('email', {
    to: 'user.email', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
    subject: 'Test Email', // REQUIRED. 
    otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables. 
  }, function (err) {
    if (err) {
      // handle error 
      console.log(err);
      res.send('There was an error sending the email');
      return;
    }
    res.send('Email Sent');
  });
});*/

//Not working either, but here I am trying to enable the user to upload a file (portfolio piece)
//to a database, and allow it to be viewed in their profile page.
router.post('/file/upload', function(req, res, next) {
  // req.files contains all the information about the files that
  // have been uploaded, lets print it out and see what is in it
  var portfolioObject = {};
  var currentUser = req.session.username;
  var name = req.files[0].filename;
  portfolioObject.user = currentUser;
  //portfolioObject.fileLocation = req.files.portfolioItem.name;
  portfolioObject.fileLocation = name;
  //portfolioObject.filename = req.body.portfolioItemName;
  
  var db=req.db;
  var collection = db.get('userTable');
  
  
  collection.findAndModify({username: currentUser}, {$set: {newPortfolioItem: portfolioObject}}, {}), function(){
            console.log("Successful Update");  
  };
  
  console.log(req.files + "Success");
  res.redirect('/dashboard');
});

module.exports = router;
