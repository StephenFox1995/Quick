var 
  app         = require('../../app.js'),
  request     = require('supertest')(app),
  chai        = require('chai'),
  testConfig  = require('../testConfig'),
  expect      = chai.expect;


describe('POST /purchase', function() {
  var token = testConfig.token;

  it ('Should make a purchase and return http code 200', function(done) {
    var body = {
      purchase : {
        productID: 'HkrwIDcY',
        businessID: 'rkxd5WL5'
      }
    };
    // Make POST request.
    request
    .post('/purchase')
    .set('Authorization', token)
    .send(body)
    .expect(200)
    .expect(function(res) {
      expect(res.body.success).to.equal(true);
    })
    .end(function(err, res) {
      done(err);
    });  
  });

  it ('Should make a purchase with invalid body and return http code 422', function(done) {
    var body = {
      purchase : {
        productID: 'HkrwIDcY',
        businessID: ''
      }
    };
    // Make POST request.
    request
    .post('/purchase')
    .set('Authorization', token)
    .send(body)
    .expect(422)
    .expect(function(res) {
      expect(res.body.success).to.equal(false);
    })
    .end(function(err, res) {
      done(err);
    });  
  });
  
  it ('Should make a purchase without a valid token and return http code 401', function(done) {
    var body = {
      purchase : {
        productID: 'HkrwIDcY',
        businessID: 'rkxd5WL5'
      }
    };
    // Make POST request.
    request
    .post('/purchase')
    .send(body)
    .expect(401)
    .expect(function(res) {
      expect(res.body.success).to.equal(false);
    })
    .end(function(err, res) {
      done(err);
    });  
  });
});
