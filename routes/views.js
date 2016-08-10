var express = require('express');

var router = express.Router();


router.get('/registerBusiness', function (req, res) {
  return res.render('registerBusiness');
});

router.get('/business', function (req, res) {
  return res.render('business')
});

router.get('/addProduct', function (req, res) {
  return res.render('addProduct')
});

router.get('/auth', function (req, res) {
  return res.render('auth');
});

router.get('/signUp', function (req, res) {
  return res.render('signUp');
});

router.get('/rest-api', function (req, res) {
  return res.render('restAPIDocumentation');
});



module.exports = router;
