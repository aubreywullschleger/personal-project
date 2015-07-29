require('dotenv').load();
var express = require('express');
var router = express.Router();
var unirest = require('unirest');
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var plainText = 'everything is awesome';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express'});
});

//router.get('/journal', function(req, res, next) {
//  if(req.isAuthenticated()) {
//    unirest.get('https://api.dandelion.eu/datatxt/sent/v1/?lang=en&text=' + plainText + '&$app_id='
//        + process.env.DANDELION_API_ID + '&$app_key=' + process.env.DANDELION_API_KEY)
//        .end(function (response) {
//          console.log(response.body);
//        });
//    res.end();
//  } else {
//    res.redirect('/');
//      res.end();
//    };

module.exports = router;
