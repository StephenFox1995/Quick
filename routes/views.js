var express = require('express');

var router = express.Router();


router.get('/registerBusiness', function (req, res) {
  return res.render('registerBusiness');
});

router.get('/business', function (req, res) {
  return res.render('business')
});






module.exports = router;
