var express = require('express');
var router = express.Router();


// ******************Register******************
router.get('/businessSignUp', function (req, res) {
  return res.render('register/businessSignUp');
});
router.get('/userSignUp', function (req, res) {
  return res.render('register/userSignUp');
});


// ******************Authentication******************
router.get('/auth', function (req, res) {
  return res.render('authentication/auth');
});


// ******************Business******************
router.get('/businessHome', function (req, res) {
  return res.render('business/businessHome');
});
router.get('/addProduct', function (req, res) {
  return res.render('business/addProduct');
});
router.get('/orders', function (req, res) {
  return res.render('business/orders');
});
router.get('/products', function (req, res) {
  return res.render('business/products');
});
router.get('/prediction', function (req, res) {
  return res.render('business/prediction');
});


// ******************Developer******************
router.get('/rest-api', function (req, res) {
  return res.render('developer/restAPIDocumentation');
});


// ******************User******************
router.get('/home', function (req, res) {
  return res.render('user/home');
});



module.exports = router;
