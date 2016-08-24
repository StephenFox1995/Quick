(function () {
  'use strict';

  var app =
    angular
      .module('authenticate', [
        'routeController',
        'session'
      ])
      .controller('AuthenticateController', AuthenticateController)
      .factory('authService', authService);

  AuthenticateController.inject = ['$scope', 'whereTo', 'authService', 'sessionService'];
  function AuthenticateController($scope, whereTo, authService, sessionService) {
    $scope.httpBody = {
      authType: 'user'
    };
    $scope.authenticate = function () {
      // Attempt to authenticate the user.
      authService.authenticate($scope.httpBody, function (err, data) {
        if (err) {
          return $scope.message = data.responseMessage;
        }
        sessionService.setToken(data.token);
        whereTo.nextRoute(app.LOGIN);
      });
    };
  }


  authService.inject = ['$http', 'tokenService'];
  function authService($http) {
    return {
      authenticate: authenticate
    };

    function authenticate(httpBody, callback) {
      $http.post('/authenticate', httpBody)
        .success(function (data) {
          verify(data, function (verified) {
            return verified ? callback(null, data) : callback(new Error(), data);
          });
        })
        .error(function (data) {
          return callback(new Error(), data);
        });
    }

    function verify(data, callback) {
      if (data.success) {
        return callback(true);
      } else {
        return callback(false);
      }
    }
  }
}());







