'use strict';

var express = require('express');
var user = require('../libs/user');
var httpCodes = require('../libs/httpCodes');

var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.post('/', function (req, res) {
  user.parsePOST(req,
    function sucess(user) {
      // Do something with user.
      console.log(user.firstname, user.lastname, user.password);
      res.sendStatus(httpCodes.SUCCESS);
    },
    function failure() {
      res.sendStatus(httpCodes.UNPROCESSABLE_ENTITY);
    });
});



module.exports = router;
