'use strict';

var express = require('express');
var User = require('../libs/User');
var httpCodes = require('../libs/httpCodes');
var hash = require('../libs/hash');

var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/', function (req, res) {
  var user = new User();
  user.parsePOST(req,
    function sucess(user) {
      // Now hash password and store user in db.
      var hashed = hash.hashPassword(user.password);

      user.hash = hashed.hash;
      user.salt = hashed.salt;


      res.sendStatus(httpCodes.SUCCESS);
    },
    function failure() {
      res.sendStatus(httpCodes.UNPROCESSABLE_ENTITY);
    });
});



module.exports = router;
