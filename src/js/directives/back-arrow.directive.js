angular
  .module('multiazienda')
  .directive('backArrow', backArrow);

backArrow.$inject = [];

function backArrow() {
  var directive = {};

  directive.restrict = 'E';
  directive.replace = true;
  directive.templateUrl = '/js/views/templates/back-arrow.html';
  // directive.scope = {
  //
  // }
  return directive;
}
