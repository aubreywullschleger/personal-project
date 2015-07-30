require('dotenv').load();
var express = require('express');
var unirest = require('unirest');
var db = require('monk')(process.env.MONGOLAB_URI);
var users = db.get('users');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('new')
});

router.post('/', function (req, res) {
    users.update({_id: parseInt(req.user.id)}, {$push: {entry: req.body.entry}});
    if(req.isAuthenticated()){
        unirest.get('https://api.dandelion.eu/datatxt/sent/v1/?lang=en&text=' + req.body.entry + '&$app_id='
            + process.env.DANDELION_API_ID + '&$app_key=' + process.env.DANDELION_API_KEY)
            .end(function (response) {
                users.update({_id: parseInt(req.user.id)}, {$push: {score: response.body.sentiment.score}});
            })
    } res.redirect('/')
});

module.exports = router;