var 
  Purchase  = require('../../libs/Purchase'),
  chai      = require('chai'), 
  expect    = chai.expect;


describe('Purchase Test', function() {
  var purchase = new Purchase();
  var validRequest = {
    decoded: {
      id: 'H1ErAhVc'
    }, // Mock successful token parsing
    body: {
      purchase: {
        businessID: 'rkxd5WL5',
        userID: 'H1ErAhVc',
        productID: 'rkxd5WL5898993089',
      }
    }
  };

  it('Parse request successfully and set purchase attributes from request', function(done) {
    purchase.parsePOST(validRequest, function(err) {
      expect(err).to.equal(null);
      expect(purchase.businessID).to.equal(validRequest.body.purchase.businessID);
      expect(purchase.userID).to.equal(validRequest.body.purchase.userID);
      expect(purchase.productID).to.equal(validRequest.body.purchase.productID);
      done();
    });
  });

  var invalidRequest = {
    decoded: {
      id: 'H1ErAhVc'
    }, // Mock successful token parsing
    body: {
      purchase: {
        businessID: '',
        userID: 'H1ErAhVc',
        productID: 'rkxd5WL5898993089',
      }
    }
  };

  it('Parse request with invalid request.', function(done) {
    purchase.parsePOST(invalidRequest, function(err) {
      expect(err).to.be.an('error');
      done();
    });
  });

  var noTokenRequest = {
    // Mock successful token parsing
    body: {
      purchase: {
        businessID: '',
        userID: 'H1ErAhVc',
        productID: 'rkxd5WL5898993089',
      }
    }
  };

  it('Parse request with no token.', function(done) {
    purchase.parsePOST(noTokenRequest, function(err) {
      expect(err).to.be.an('error');
      done();
    });
  });
});