require('dotenv').load();
var express = require('express');
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var router = express.Router();

router.get('/', function (req, res) {
    var user = JSON.stringify(req.user);
    console.log(user);
    users.findOne({
        _id: parseInt(req.user.id)
    }, function (err, doc) {
        if (err) {
            console.log('error')
        } else {
            res.render('graph', {score: doc.score});
        }
    });

});
module.exports = router;