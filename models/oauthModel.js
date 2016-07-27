'use strict';

var database = require('./database');

var model = exports;

model.getAccessToken = function (bearerToken, callback) {
  database.getAccessToken(bearerToken, function () {
  });
};


model.getClient = function(clientID, clientSecret, callback) {
  database.getClient(clientID, clientID, function () {

  });
};

model.getRefreshToken = function(bearerToken, callback) {

};

model.getUser = function (email, password) {
  database.getUser(email, password, function () {
    
  });
};

model.saveAccessToken = function (token, client, user, callback) {
  database.insertAccessToken(token, client, user, function () {

  });
};