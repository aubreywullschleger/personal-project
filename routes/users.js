require('dotenv').load();
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var plainText = 'everything is awesome';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//router.get('/new_entry', function(req, res, next) {
//  if(req.isAuthenticated()) {
//      router.post('/new_entry', function(req, res) {
//          users.insert()
//      })
//  }
//} else {
//    res.redirect('/')
//  });

module.exports = router;
