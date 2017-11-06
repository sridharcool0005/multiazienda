angular
  .module('multiazienda')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', 'CurrentUserService', '$window', '$state', '$location', '$scope', '$transitions'];

function MainCtrl($rootScope, CurrentUserService, $window, $state, $location, $scope, $transitions) {
  const vm = this;

  $transitions.onSuccess({}, function() {
    console.log('statechange success');
  });

  $scope.$watch(function () {
    return $location.path();
  }, function (path) {
    (path === '/login') ? vm.nav = false : vm.nav = true;
    (path === '/login' || path === '/') ? vm.canGoBack = false : vm.canGoBack = true;
    (path.includes('attivita')) ? vm.inAttivita = true : vm.inAttivita = false;
    (path.includes('clienti')) ? vm.inClienti = true : vm.inClienti = false;
    (path.includes('archivio')) ? vm.inArchivio = true : vm.inArchivio = false;
  });

  vm.logout = logout;
  vm.goBack = goBack;

  $rootScope.$on('showing modal', () => {
    (vm.showing) ? vm.showing = false : vm.showing = true;
  });

  $rootScope.$on('loggedIn', () => {
    vm.user = CurrentUserService.currentUser;
  });

  $rootScope.$on('loggedOut', () => {
    vm.user = null;
    $state.go('login');
  });

  function logout() {
    CurrentUserService.removeUser();
  }

  function goBack() {
    $window.history.back();
  }

}
