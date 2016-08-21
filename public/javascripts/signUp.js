(function () {
  'use strict';
  var app =
    angular
      .module('signUp', [])
      .controller('SignUpController', SignUpController)
      .factory('signUpService', signUpService);
  
  SignUpController.inject = ['$scope', 'signUpService'];
  function SignUpController($scope, signUpService) {
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


