var 
  request = require('supertest')('http://localhost:3000'),
  chai = require('chai'),
  expect = chai.expect;


describe('POST /business.', function() {
  // Email used to sign up business.
  var email = Math.random().toString(36).substr(2, 5);
  var password = 'badpassword';
  it('Should add the business to the applications database and return http code 200', function(done) {
    // Mock user.
    var body = {
      business : {
        name: 'Great New Business',
        address: '33 Space Drive',
        contactNumber: '50-50-203-892',
        
        // gen random string so we don't insert duplicate and get 500 response.
        email: email,
        password: password
      }
    };
    // Make POST request.
    request
    .post('/business')
    .send(body)
    .expect(200)
    .expect(function(res) {
      expect(res.body.success).to.equal(true);
    })
    .end(function(err, res) {
      done(err);
    });  
  }); 
});
	


