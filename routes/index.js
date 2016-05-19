var express = require('express');
var router = express.Router();
var bodyParset = require('body-parser');

var mongoClient = require('mongodb').MongoClient;


var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://dbuserclaire:litclonmel@ds030719.mlab.com:30719/portfoliodb';



/* GET home page. */
router.post('/', function(req, res, next) {
  var db = req.db;
  var firstname = req.body.firstname;
  var surname = req.body.surname;
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  
  var collection=db.get('userTable');
  
  collection.insert({
    "firstname": username,
    "surname": firstname,
    "username": username,
    "email": email,
    "password": password
  }, function(err, doc){
    if(err){
      res.send("Problem adding info to the Database");
    }
    else{
     req.session.userName = username;
     console.log(req.session.username);
     res.redirect('/');
    }
  });
  //res.render('homepage', { title: 'Express' });
});

router.get('/welcome', function(req, res, next){
  res.render('welcome');
});

router.get('/dashboard', function(req, res, next){
  res.render('dashboard');
});


router.get('/myPortfolio', function(req, res, next){
  var yourName = req.query.yourName;
  req.session.userName =yourName;
  res.render('Hello', {usersName: yourName});
});
module.exports = router;
