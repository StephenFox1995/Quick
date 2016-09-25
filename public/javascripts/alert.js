(function() {
  angular.module('alert', [])
  .directive('successAlert', successAlert);


  function successAlert() {
    var html = 
    '<div class="row">' +
      '<div class="alert alert-success">' +
        '<strong>Success!</strong> Product has been added.' +
      '</div>' + 
    '</div>';  
    return {
      restrict: 'E',
      replace: true,
      template: html
    };  
  }
})();