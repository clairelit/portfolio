var express = require('express');
var router = express.Router();
var bodyParset = require('body-parser');

var mongoClient = require('mongodb').MongoClient;


var url = process.env.CUSTOMCONNSTR_MongoDB || 'mongodb://dbuserclaire:litclonmel@ds030719.mlab.com:30719/portfoliodb';



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('homepage', { title: 'Express' });
});

router.get('/welcome', function(req, res, next){
  res.render('welcome');
});


router.get('/myPortfolio', function(req, res, next){
  var yourName = req.query.yourName;
  req.session.userName =yourName;
  res.render('Hello', {usersName: yourName});
});
module.exports = router;
