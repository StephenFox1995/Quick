(function () {
  'use strict';
  angular
    .module('signUp', [
      'session'
    ])
    .controller('SignUpController', SignUpController)
    .factory('signUpService', signUpService);

  
  SignUpController.inject = ['$scope', 'signUpService', 'session'];
  function SignUpController($scope, signUpService, session) {
    $scope.httpBody = {};
    $scope.message = '';
    $scope.signUpModel = {};


    $scope.signUp = function () {
      if (!$scope.signUpModel.endPoint) { return; }
      var endPoint = $scope.signUpModel.endPoint;

      signUpService.signUp(endPoint, $scope.httpBody, function (err, response) {
        if (err) {
          return $scope.message = 'Failed to sign up.';
        }
        session.setToken(response.token);
        $scope.message = 'Sign up successful';
      })
    }
  }

  signUpService.inject = ['$http'];
  function signUpService($http) {
    return {
      signUp: signUp
    };

    function signUp(endPoint, httpBody, callback) {
      $http.post(endPoint, httpBody)
        .success(function (data) {
          verify(data) ? callback(null, data): callback(new Error(), data);
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


