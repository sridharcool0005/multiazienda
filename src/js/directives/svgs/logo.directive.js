angular
  .module('multiazienda')
  .directive('logo', logo);

logo.$inject = [];

function logo() {
  var directive = {};

  directive.restrict = 'E';
  directive.replace = true;
  directive.templateUrl = '/js/views/templates/logo.html';
  // directive.scope = {
  //
  // }
  return directive;
}
