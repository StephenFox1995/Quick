var app =
  angular
    .module('home', [
      'session'
    ]);

app.controller('homeController',
  ['$scope',
    'sessionFactory',
    function ($scope,
              sessionFactory) {
      $scope.token = 'cock';
      $scope.token = sessionFactory.data.token;
      console.log($scope.token);
}]);
