angular
  .module('multiazienda')
  .directive('barsForms', barsForms);

barsForms.$inject = [];

function barsForms() {
  const directive = {
    restrict: 'E',
    replace: true,
    templateUrl: '/js/views/templates/forms/bars-forms.html',
    scope: {
      controller: '='
    }
  };
  return directive;
}
