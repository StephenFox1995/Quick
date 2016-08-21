var app = angular.module('session', []);

app.factory('sessionFactory', function() {
  return Session = {
    data: {}
  };
});