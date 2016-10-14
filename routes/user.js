'use strict';

var 
  express   = require('express'),
  httpCodes = require('../libs/httpCodes'),
  controller = require('../libs/controllers/userRouteController');


const router = express.Router();


/**
 * Adds a new user to the database.
 * EndPoint: /user
 * TODO: Make sure user doesn't already exist in database
 **/
router.post('/', function (req, res) {
  controller.handlePost(req, function(err, token) {
    if (err) {
      return res
        .status(err.code)
        .json({
          responseMessage: err.message,
          success: false
        });
    }
    return res
      .status(httpCodes.SUCCESS)
      .json({
        responseMessage: "User was successfully created.",
        success: true,
        token: token.value,
        expires: token.expiresIn
      });
  });
});



module.exports = router;
