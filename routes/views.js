var express = require('express');

var router = express.Router();


router.get('/businessSignUp', function (req, res) {
  return res.render('register/businessSignUp');
});
router.get('/business', function (req, res) {
  return res.render('business');
});
router.get('/addProduct', function (req, res) {
  return res.render('addProduct');
});
router.get('/auth', function (req, res) {
  return res.render('auth');
});
router.get('/userSignUp', function (req, res) {
  return res.render('register/userSignUp');
});
router.get('/rest-api', function (req, res) {
  return res.render('restAPIDocumentation');
});
router.get('/home', function (req, res) {
  return res.render('home');
});
router.get('/businessHome', function (req, res) {
  return res.render('businessHome');
});
router.get('/orders', function (req, res) {
  return res.render('orders');
});


module.exports = router;
