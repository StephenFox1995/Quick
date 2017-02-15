(function () {
  'use strict';
  angular
    .module('signUp', [
      'session',
      'routes'
    ])
    .controller('SignUpController', SignUpController)
    .factory('signUpService', signUpService);

  
  SignUpController.inject = ['$scope', 'signUpService', 'sessionService', 'whereTo', 'ROUTES'];
  function SignUpController($scope, signUpService, sessionService, whereTo, ROUTES) {
    $scope.httpBody = {};
    $scope.message;
    $scope.endPoint;


    $scope.signUp = function () {
      if (!$scope.endPoint) { return; }
      var endPoint = $scope.endPoint;

      signUpService.signUp(endPoint, $scope.httpBody, function (err, response) {
        if (err) {
          return $scope.message = 'Failed to sign up.';
        }
        // Determine where to go next.
        switch (endPoint) {
          case '/user':
            sessionService.setToken(response.token);
            whereTo.nextRoute(ROUTES.home);
            break;
          case '/business':
            sessionService.setToken(response.token);
            whereTo.nextRoute(ROUTES.businessHome);
            break;
        }
      });
    };
  }

  signUpService.inject = ['$http'];
  function signUpService($http) {
    return {
      signUp: signUp
    };

    function signUp(endPoint, httpBody, callback) {
      $http.post(endPoint, httpBody)
        .success(function (data) {
          verify(data) ? callback(null, data) : callback(new Error(), data);
        })
        .error(function (data) {
          callback(new Error(), data);
        });
    }
    
    function verify(data) {
      if (data.success) {
        return true;
      } else {
        return false;
      }
    }
  }
}());


