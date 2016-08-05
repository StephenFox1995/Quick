var express = require('express');

var router = express.Router();


router.get('/registerBusiness', function (req, res) {
  return res.render('registerBusiness');
});

router.get('/signIn', function (req, res) {
  return res.render('signIn');
});




module.exports = router;
