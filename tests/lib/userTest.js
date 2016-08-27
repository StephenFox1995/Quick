var 
  User = require('../../libs/User'),
  chai = require('chai'),
  config = require('../../config/runConfig'),
  expect = chai.expect;


describe('User Test', function() {
  // Get connection to the database.
  // config.locateDatabase();
  var mockRequestValid = {
    body: {
      user: {
        firstname: 'Stephen',
        lastname: 'Fox',
        password: 'test',
        email: 'ss@email.com'
      }
    }
  };
  
  var user = new User();
  it("Parse request successfully and set user attributes from request.", function() {
    user.parsePOST(mockRequestValid, function(err) {
      expect(err).to.equal(null);
      expect(user.firstname).to.equal(mockRequestValid.body.user.firstname);
      expect(user.lastname).to.equal(mockRequestValid.body.user.lastname);
      expect(user.password).to.equal(mockRequestValid.body.user.password);
      expect(user.email).to.equal(mockRequestValid.body.user.email);
    });
  });

  //Note: this test will only pass if a user actually exists in the database.
  it("Verify a valid user exists and check password, with an actual valid user.", function() {
    user.verify(function(err, verified) {
      expect(err).to.equal(null);
      expect(verified).to.equal(true);
    });
  });

  it("Verify a user with the wrong password.", function() {
    user.password = 'wrongpassword';
    user.verify(function(err, verified) {
      expect(err).to.equal(null);
      expect(verified).to.equal(false);
    });
  });

  var mockRequestInvalid = {
    body: {
      user: {
        firstname: 'Stephen',
        lastname: 'Fox',
        password: 'badpassword',
        email: ''
      }
    }
  };

  it("Parse invalid request and expect error object.", function() {
    user.parsePOST(mockRequestInvalid, function(err) {
      expect(err).to.be.an('error');
    });
  });
}); 