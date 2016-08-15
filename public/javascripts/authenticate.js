var app = angular.module('authenticate', ['routeController']);

app.controller('authenticateController',
  ['$scope',
    '$http',
    'whereTo',
    'signInResponse',
    function ($scope,
              $http,
              whereTo,
              signInResponse) {

      $scope.httpBody = {
        authType: 'user'
      };

      $scope.authenticate = function () {
        $http.post('/authenticate', $scope.httpBody)
          .success(function (data) {
            signInResponse.verify(data, function (success) {
              if (success) {
                // Continue to log user in.
                // Ask the router what the next page should be.
                whereTo.nextRoute(app.LOGIN);
              } else {
                $scope.message = 'Could not log in.';
              }
            });
          })
          .error(function (data) {
            $scope.message = data.responseMessage;
          });
      };
    }
  ]);


// Verify that a successful login has been made.
app.factory('signInResponse', function () {
  return {
    verify: function (data, callback) {
      if (data.success) {
        return callback(true);
      } else {
        return callback(false);
      }
    }
  }
});


