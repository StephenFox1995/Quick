var 
  app     = require('../../app.js'),
  request = require('supertest')(app),
  chai    = require('chai'),
  expect  = chai.expect;



describe('POST /business.', function() {
  // Email used to sign up business.
  var email = Math.random().toString(36).substr(2, 5) + '@test.com';
  var password = 'badpassword';

  it('Should add the business to the database and return http code 200', function(done) {
    // Mock business.
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

  it('Should add a business with invalid details and return http code 422', function(done) {
    // Mock business.
    var body = {
      business : {
        name: 'Great New Business',
        address: '33 Space Drive',
        contactNumber: '50-50-203-892',
        // gen random string so we don't insert duplicate and get 500 response.
        email: '', // Omit the password.
        password: password
      }
    };
    // Make POST request.
    request
    .post('/business')
    .send(body)
    .expect(422)
    .expect(function(res) {
      expect(res.body.success).to.equal(false);
    })
    .end(function(err, res) {
      done(err);
    }); 
  });
});


	


