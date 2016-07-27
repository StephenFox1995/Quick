var express = require('express'),
    oauthserver = require('oauth2-server');

var router = express.Router();
var app = express();


/***********************
 *  OAuth
 ***********************/
app.oauth = oauthserver({
  model: require('../models/oauthModel'), // See below for specification
  grants: ['password'],
  debug: true
});


app.all('/oauth/token', app.oauth.grant());

router.get('/' , app.oauth.authorise(), function(req, res) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
