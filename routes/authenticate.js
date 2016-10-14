'use strict';


var 
  express   = require('express'),
  httpCodes = require('../libs/httpCodes'),
  controller = require('../libs/controllers/authenticateRouteController');


var router = express.Router();


/**
 * The app can authenticate two types of clients;
 * users and businesses. To distinguish between the two
 * types of authentication the following field must be
 * sent in the body of the request authType.
 * The full request body should adhere to the following format.
 * {
 *    "authType": "business",
 *    "user": {
 *      "email": "someemail@email.com",
 *      "password": "password"
 *    }
 * }
 *
 * To authenticate we must execute the following code flow.
 * 1. Parse and verify the POST request.
 * 2. Check the user's email exists in the database.
 * 3. If the user's email exists, get the password.
 * 4. Compare the password sent in the POST request
 *    with the hashed password from the database.
 * 5. Send response based on the comparison of these passwords.
 *
 * A successful login attempt will return HTTP Code 200.
 * A failed login attempt will return a HTTP Code 400.
 *
 *
 * */
router.post('/', function (req, res) {
  controller.handlePost(req, function(err, token) {
    if (err) {
      return res
        .status(err.code)
        .json({ responseMessage: err.message });
    }
    return res
      .status(httpCodes.SUCCESS)
      .json({
        success: true,
        responseMessage: 'Successfully authenticated.',
        expires: token.expiresIn,
        token: token.value
      });
  }); 
});


module.exports = router;