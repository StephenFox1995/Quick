(() => {
  angular.module('alert', [])
  .directive('alert', alert);


  /**
   * A directive for displaying alerts to users.
   * The alert uses Bootstrap alert styling
   * and has the following {{alertStyle}} options
   *  -  succcess
   *  -  info
   *  -  warning
   *  -  danger
   *
   * @return {object} - Directive object.
   */
  function alert() {
    const html =
    '<div class="row">' +
      '<div class="alert alert-{{alertStyle}}">' +
        '<strong>{{alertTitle}}!</strong> {{alertMessage}}' +
      '</div>' +
    '</div>';
    return {
      restrict: 'E',
      replace: true,
      template: html,
    };
  }
})();
