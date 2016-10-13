var
  controller = require('../../libs/productRouteController'),
  chai = require('chai'), 
  expect = chai.expect;


describe('ProductRouteControllerTest', function() {

});
var req = {
  body: {
    product: {
      name: 'Name of product',
      description: 'This is a description',
      price: 3000
    }
  }
};
controller.handlePost(req, function(err, product) {
  
});