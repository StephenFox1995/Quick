var 
  Product     = require('../../libs/Product'),
  chai        = require('chai'),  
  expect      = chai.expect;


describe('Product Test', function() {
  var product = new Product();
  var validRequest = {
    body: {      
      product: {
        businessID: 'rkxd5WL5',
        name: 'Test Product',
        price: '14030',
        description: 'Test product description'
      }
    }
  };

  it('Parse request successfully and set product attributes from request', function(done) {
    product.parsePOST(validRequest, function(err) {
      expect(err).to.equal(null);
      expect(product.businessID).to.equal(validRequest.body.product.businessID);
      expect(product.name).to.equal(validRequest.body.product.name);
      expect(product.price).to.equal(validRequest.body.product.price);
      done();
    });
  });


  var invalidRequest = {
    body: {
      product: {
        businessID: 'rkxd5WL5',
        name: 'Test Product',
        price: '',
        description: 'Test product description',
      }
    }
  };

  it('Parse invalid request and expect error object', function(done) {
    product.parsePOST(invalidRequest, function(err) {
      expect(err).to.be.an('error');
      done();
    });
  });  
});