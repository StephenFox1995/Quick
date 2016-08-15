var app = angular.module('registerBusiness', []);

app.controller('registerBusinessController', function ($scope, $http) {
  $scope.businessData = {};

  $scope.registerBusiness = function () {
    $http.post('/business', $scope.businessData)
      .success(function (data) {
        $scope.message = "Success!";
        window.location.href = 'http://localhost:3000/views/business';
      })
      .error(function (data) {
        $scope.message = "Account creation error.";
      });
  }
});

var app = angular.module('businessSignUp', []);


app.controller('businessSignUpController', ['$scope', '$http', function ($scope, $http) {
  $scope.httpBody = {
    authType: 'business'
  };

  $scope.createAccount = function () {
    $http.post('/business', $scope.httpBody)
      .success(function (data) {

      })
      .error(function (data) {
        
      });
  }
}]);