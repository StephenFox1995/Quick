var 
  Business = require('../../libs/Business'),
  chai = require('chai'), 
  expect = chai.expect;


describe('Business Test', function() {
  // Get connection to the database.
  var mockRequestValid = {
    body: {
      business: {
        name: 'Random Business',
        address: '22 Random Address',
        contactNumber: '4829303302',
        email: 'quickco@email.com',
        password: '123456'
      }
    }
  };
  
  var business = new Business();
  it('Parse request successfully and set business attributes from request.', function(done) {
    business.parsePOST(mockRequestValid, function(err) {
      expect(err).to.equal(null);
      expect(business.name).to.equal(mockRequestValid.body.business.name);
      expect(business.address).to.equal(mockRequestValid.body.business.address);
      expect(business.contactNumber).to.equal(mockRequestValid.body.business.contactNumber);
      expect(business.email).to.equal(mockRequestValid.body.business.email);
      expect(business.password).to.equal(mockRequestValid.body.business.password);
      done();
    });
  });

  //Note: this test will only pass if a user actually exists in the database.
  it('Verify a valid business exists and check password, with an actual valid business.', function(done) {
    business.verify(function(err, verified) {
      expect(err).to.equal(null);
      expect(verified).to.equal(true);
      done();
    });
  });

  it('Verify a business with the wrong password.', function(done) {
    business.password = 'wrongpassword';
    business.verify(function(err, verified) {
      expect(err).to.equal(null);
      expect(verified).to.equal(false);
      done();
    });
  });

  var mockRequestInvalid = {
    body: {
      business: {
        name: 'Random Business',
        address: '22 Random Address',
        contactNumber: '4829303302',
        email: '',
        password: 'strong-password'
      }
    }
  };

  it('Parse invalid request and expect error object.', function(done) {
    business.parsePOST(mockRequestInvalid, function(err) {
      expect(err).to.be.an('error');
      done();
    });
  });
}); 