var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var mongoClient = require('mongodb').MongoClient;
var monk = require('monk');

var db = monk('mongodb://localhost:27017/portfoliodb');

//var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://dbuserclaire:litclonmel@ds030719.mlab.com:30719/portfoliodb';
var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://localhost:27017/portfoliodb';



/* GET home page. */
router.post('/register', function(req, res, next) {
  var db = req.db;
  var firstname = req.body.firstname;
  var surname = req.body.surname;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var confirm = req.body.confirm;
  
  var collection=db.get('userTable');
  
  collection.insert({
    "firstname": firstname,
    "surname": surname,
    "username": username,
    "email": email,
    "password": password,
    "confirm": confirm
  }, function(err, doc){
    if(err){
      res.send("Problem adding info to the Database");
      console.log(err.message);
    }
    else{
     req.session.username = username;
     console.log(req.session.username);
     res.redirect('/dashboard');
    }
  });
});



router.post('/login', function(req, res, next){
  var enteredUserName = req.body.username;
  console.log(enteredUserName);
  console.log(req.body.userName);
  var enteredPassword = req.body.password;
  var db = req.db;
  var collection = db.get('userTable');
  collection.find({username: enteredUserName},{},function(e, docs){
    for(var i in docs){
      if(docs[i].password == enteredPassword){
        var userName = req.body.username;
        req.session.userName = username;
        res.redirect('/dashboard');
      }
      else{
        res.render('wronglogin');
      }
    }
});
});





router.get('/', function(req, res, next){

   if(req.session.username === "undefined" || req.session.userName == null){
    res.render('homepage');
  }
  else{
    res.redirect("/profilepage");
  }
});

router.get('/welcome', function(req, res, next){
  res.render('welcome');
});

router.get('/dashboard', function(req, res, next){
  var loggedInUser = req.session.username;
  //var db=req.db;
  var collection=db.get('userTable');
  var personDetails = collection.find({ username: loggedInUser }, function (err, doc) {
    if (err) throw err;
    else{
      res.render('dashboard', {userDetails: doc});
      console.log(doc);
    }
}); 
});


router.get('/myPortfolio', function(req, res, next){
  var yourName = req.query.yourName;
  req.session.userName =yourName;
  res.render('Hello', {usersName: yourName});
});
module.exports = router;
