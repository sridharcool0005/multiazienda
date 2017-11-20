angular.module('multiazienda').directive('profilePicture', profilePicture);

profilePicture.$inject = [];

function profilePicture() {
  var directive = {};

  directive.restrict = 'E';
  directive.replace = true;
  directive.templateUrl = '/js/views/templates/profile-picture.html';
  // directive.scope = {
  //
  // }
  return directive;
}
