require('dotenv').load();
var express = require('express');

var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');

var router = express.Router();

module.exports = router;