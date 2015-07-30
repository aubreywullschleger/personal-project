require('dotenv').load();
var express = require('express');
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var router = express.Router();

router.post('/', function(req, res) {
    users.remove({_id: parseInt(req.user.id)})
});

module.exports = router;