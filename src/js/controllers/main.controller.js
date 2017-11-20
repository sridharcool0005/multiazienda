angular.module('multiazienda').controller('MainCtrl', MainCtrl);

MainCtrl.$inject = [
  '$rootScope',
  'CurrentUserService',
  '$window',
  '$state',
  '$location',
  '$scope',
  'screenSize',
  '$transitions',
  '$timeout'
];

function MainCtrl(
  $rootScope,
  CurrentUserService,
  $window,
  $state,
  $location,
  $scope,
  screenSize,
  $transitions,
  $timeout
) {
  const vm = this;

  vm.logout = logout;
  vm.goBack = goBack;
  vm.expandMenu = expandMenu;
  vm.getSizes = getSizes;

  getSizes();

  $transitions.onSuccess({}, function() {
    $window.scrollTo(0, 0);
  });

  $scope.$watch(
    function() {
      return $location.path();
    },
    function(path) {
      path === '/login' ? (vm.nav = false) : (vm.nav = true);
      path === '/login' || path === '/'
        ? (vm.canGoBack = false)
        : (vm.canGoBack = true);
      if (path.includes('attivita') && path.includes('clienti')) {
        vm.inClienti = true;
        vm.inAttivita = false;
      } else {
        path.includes('attivita')
          ? (vm.inAttivita = true)
          : (vm.inAttivita = false);
        path.includes('clienti')
          ? (vm.inClienti = true)
          : (vm.inClienti = false);
        path.includes('archivio')
          ? (vm.inArchivio = true)
          : (vm.inArchivio = false);
      }
    }
  );

  $window.addEventListener('resize', getSizes);

  $rootScope.$on('showing modal', function(event, args) {
    vm.showing ? (vm.showing = false) : (vm.showing = true);

    if (args.which === 'type') {
      vm.showTypeForm ? (vm.showTypeForm = false) : (vm.showTypeForm = true);
    } else if (args.which === 'zone') {
      vm.showZoneForm ? (vm.showZoneForm = false) : (vm.showZoneForm = true);
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
    if (err.status === 401) {
      $state.go('login');
      $rootScope.$broadcast('displayMessage', {
        type: 'danger',
        content: err.data.message
      });
    } else {
      $rootScope.$broadcast('displayMessage', {
        type: 'warning',
        content: err.data.message
      });
    }
  });

  $rootScope.$on('displayMessage', (e, message) => {
    vm.message = message.content;
    vm.messageType = message.type;
    if (!$scope.$$phase) $scope.$apply();

    $timeout(closeMessage, 3000);
  });

  function logout() {
    CurrentUserService.removeUser();
    var navMenu = document.getElementById('multiaziendaNav');

    if (navMenu.className === 'multiaziendaNav') {
      navMenu.className += ' responsive';
    } else {
      navMenu.className = 'multiaziendaNav';
    }
  }

  function goBack() {
    $window.history.back();
  }

  function closeMessage() {
    vm.message = null;
    vm.messageType = null;
  }

  function expandMenu() {
    vm.isExtraSmall = screenSize.is('xs');

    if (vm.isExtraSmall) {
      var navMenu = document.getElementById('multiaziendaNav');
      var navWrapper = document.querySelector('.nav-wrapper');
      var expandables = document.getElementsByClassName('expandable-item');

      expandCollapse(navWrapper, expandables);

      if (navMenu.className === 'multiaziendaNav') {
        navMenu.className += ' responsive';
      } else {
        navMenu.className = 'multiaziendaNav';
      }
    }
  }

  function expandCollapse(navWrapper, expandables) {
    if (navWrapper.clientHeight) {
      navWrapper.style.height = 0;
      for (var i = 0; i < expandables.length; i++) {
        expandables[i].style.display = 'none';
      }
    } else {
      navWrapper.style.height = '194px';
      for (var j = 0; j < expandables.length; j++) {
        expandables[j].style.display = 'block';
      }
    }
  }

  function getSizes() {
    vm.isExtraSmall = screenSize.is('xs');
    vm.isSmall = screenSize.is('xs, sm');
    vm.isLarge = screenSize.is('md, lg');
  }
}
