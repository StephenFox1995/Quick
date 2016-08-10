var app = angular.module('store', []);

app.factory('Session', function($http) {
  var Session = {
    data: {},
    saveSession: function() {
      // TODO: Save Session to the sqlite3DB.
    },
    updateSession: function() {
      // TODO: Load any necessary session data from the sqlite3DB, server side.
      $http.get('session.json').then(function(r) { return Session.data = r.data;});
    }
  };
  Session.updateSession();
  return Session;
});