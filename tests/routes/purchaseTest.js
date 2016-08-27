var 
  request = require('supertest')('http://localhost:3000'),
  chai = require('chai'),
  expect = chai.expect;


describe('POST /purchase', function() {
  var token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NzIyMjg0NTksImV4cCI6MTUwMzc2NDQ1OSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoic3NAZ21haWwuY29tIiwiR2l2ZW5OYW1lIjoiU3RlcGhlbiAiLCJTdXJuYW1lIjoiRm94IiwiRW1haWwiOiJzc0BnbWFpbC5jb20ifQ.hOIoXt4KITxb5o4o7fbK8l5-lJEuf9Qs4N5seMe9Oiw';

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
