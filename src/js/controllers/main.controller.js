angular
  .module('multiazienda')
  .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$rootScope', 'CurrentUserService', '$window', '$state', '$location', '$scope', '$transitions', '$timeout'];

function MainCtrl($rootScope, CurrentUserService, $window, $state, $location, $scope, $transitions, $timeout) {
  const vm = this;

  $transitions.onSuccess({}, function() {
    $window.scrollTo(0, 0);
  });

  $scope.$watch(function () {
    return $location.path();
  }, function (path) {
    (path === '/login') ? vm.nav = false : vm.nav = true;
    (path === '/login' || path === '/') ? vm.canGoBack = false : vm.canGoBack = true;
    if (path.includes('attivita') && path.includes('clienti')) {
      vm.inClienti = true;
      vm.inAttivita = false;
    } else {
      (path.includes('attivita')) ? vm.inAttivita = true : vm.inAttivita = false;
      (path.includes('clienti')) ? vm.inClienti = true : vm.inClienti = false;
      (path.includes('archivio')) ? vm.inArchivio = true : vm.inArchivio = false;
    }
  });

  vm.logout = logout;
  vm.goBack = goBack;

  $rootScope.$on('showing modal', function(event, args) {
    (vm.showing) ? vm.showing = false : vm.showing = true;
    
    if (args.which === 'type') {
      (vm.showTypeForm) ? vm.showTypeForm = false : vm.showTypeForm = true;
    } else if (args.which === 'zone') {
      (vm.showZoneForm) ? vm.showZoneForm = false : vm.showZoneForm = true;
    }
  });

  $rootScope.$on('loggedIn', () => {
    vm.user = CurrentUserService.currentUser;
  });

  $rootScope.$on('loggedOut', () => {
    vm.user = null;
    $state.go('login');
  });

  $rootScope.$on('error', (e, err) => {
    if(err.status === 401) {
      $state.go('login');
      $rootScope.$broadcast('displayMessage', {
        type: 'danger',
        content: err.data.message
      });
    }
  });

  $rootScope.$on('displayMessage', (e, message) => {
    vm.message = message.content;
    vm.messageType = message.type;

    $timeout(closeMessage, 5000);
  });

  function logout() {
    CurrentUserService.removeUser();
  }

  function goBack() {
    $window.history.back();
  }

  function closeMessage() {
    vm.message     = null;
    vm.messageType = null;
  }

}
