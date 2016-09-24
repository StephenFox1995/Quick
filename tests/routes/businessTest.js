var 
  app = require('../../app.js'),
  request = require('supertest')(app),
  chai = require('chai'),
  expect = chai.expect;

var token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NzI0NzEzODAsImV4cCI6MTUwNDAwNzM4MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImlkIjoicmt4ZDVXTDUifQ.QJNy6o-GfXTP686zgIrEiI37strpFm7n9-ImPFMQprg';


describe('POST /business.', function() {
  // Email used to sign up business.
  var email = Math.random().toString(36).substr(2, 5) + '@stephenfox.com';
  var password = 'badpassword';

  it('Should add the business to the applications database and return http code 200', function(done) {
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

  it('Should sign up with invalid details and return http code 422', function(done) {
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

describe('GET /business/purchases', function() {
  it ('Should retrieve all purchases for a business', function(done) {
     // Make GET request.
    request
    .get('/business/purchases')
    .set('Authorization', token)
    .expect(200)
    .expect(function(res) {
      expect(res.body.success).to.equal(true);
    })
    .end(function(err, res) {
      done(err);
    }); 
  });

  it ('Should retrieve all products for a business', function(done) {
    var businessID = 'BJjgTuli';
    // Make GET request.
    request.get('/business/' + businessID + '/products')
    .expect(200)
    .expect(function(res) {
      expect(res.body.success).to.equal(true);
    })
    .end(function(err, res) {
      done(err);
    });
  });
});


	


