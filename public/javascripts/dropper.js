(function () { 
  angular.module('dropper', [])
    .directive('dropItem', dropItem)
    .directive('inputDropper', inputDropper);

  function dropItem() {
    return {
      restrict: 'A',
      require: '^inputDropper',
      controller: ['$scope', function ($scope) {
        $scope.value = 'Euro €';
        $scope.updateValue = function (newValue) {
          $scope.value = newValue;
        };
      }],
      link: function (scope, elem, attrs) {
        elem.on('click', function () {
          scope.updateValue(attrs.id);
          scope.$apply();
        });
      }
    };
  }

  function inputDropper() {
    return {
      controller: function ($scope) { }
    };
  }
})();