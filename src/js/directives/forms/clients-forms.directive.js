angular
  .module('multiazienda')
  .directive('clientsForms', clientsForms);

clientsForms.$inject = [];

function clientsForms() {
  const directive = {
    restrict: 'E',
    replace: true,
    templateUrl: '/js/views/templates/forms/clients-forms.html',
    scope: {
      controller: '='
    }
  };
  return directive;
}
