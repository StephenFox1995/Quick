(function () {
  angular
    .module('authenticate', [
      'routes',
      'session'
    ])
    .controller('AuthenticateController', AuthenticateController)
    .factory('authService', authService);

  AuthenticateController.inject = ['$scope', 'whereTo', 'authService', 'sessionService', 'ROUTES'];
  function AuthenticateController($scope, whereTo, authService, sessionService, ROUTES) {
    $scope.httpBody = {};
    $scope.authenticate = function () {
      // Attempt to authenticate the user.
      authService.authenticate($scope.httpBody, function (err, data) {
        if (err) {
          return $scope.message = data.responseMessage;
        }
        sessionService.setToken(data.token);
        switch($scope.httpBody.authType.toLowerCase()) {
          case 'user':
            whereTo.nextRoute(ROUTES.home);
            break;
          case 'business':
            whereTo.nextRoute(ROUTES.businessHome);
            break;
        }
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







