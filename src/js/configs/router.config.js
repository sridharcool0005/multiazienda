angular
  .module('multiazienda')
  .config(Router);

Router.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider'];

function Router($stateProvider, $locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  console.log('ROUTER');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/js/views/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'login'
    })
    .state('home', {
      url: '/',
      templateUrl: '/js/views/home.html',
      controller: 'HomeCtrl',
      controllerAs: 'home',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('barsIndex', {
      url: '/attivita',
      templateUrl: '/js/views/bars/bars-index.html',
      controller: 'BarsIndexCtrl',
      controllerAs: 'bars',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('barNew', {
      url: '/attivita/nuova',
      templateUrl: '/js/views/bars/bar-new.html',
      controller: 'BarNewCtrl',
      controllerAs: 'bar',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('barShow', {
      url: '/attivita/:id',
      templateUrl: '/js/views/bars/bar-show.html',
      controller: 'BarShowCtrl',
      controllerAs: 'bar',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('barEdit', {
      url: '/attivita/:id/modifica',
      templateUrl: '/js/views/bars/bar-edit.html',
      controller: 'BarEditCtrl',
      controllerAs: 'bar',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('clientsIndex', {
      url: '/clienti',
      templateUrl: '/js/views/clients/clients-index.html',
      controller: 'ClientsIndexCtrl',
      controllerAs: 'clients',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('clientNew', {
      url: '/clienti/nuovo',
      templateUrl: '/js/views/clients/client-new.html',
      controller: 'ClientNewCtrl',
      controllerAs: 'client',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('clientShow', {
      url: '/clienti/:id',
      templateUrl: '/js/views/clients/client-show.html',
      controller: 'ClientShowCtrl',
      controllerAs: 'client',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('clientEdit', {
      url: '/clienti/:id/modifica',
      templateUrl: '/js/views/clients/client-edit.html',
      controller: 'ClientEditCtrl',
      controllerAs: 'client',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('seenBarNew', {
      url: '/clienti/:id/attivita/nuova',
      templateUrl: '/js/views/seenBars/seenBar-new.html',
      controller: 'SeenBarNewCtrl',
      controllerAs: 'seenBar',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('seenBarShow', {
      url: '/clienti/:id/attivita/:barId',
      templateUrl: '/js/views/seenBars/seenBar-show.html',
      controller: 'SeenBarShowCtrl',
      controllerAs: 'seenBar',
      resolve: {
        loginRequired: loginRequired
      }
    })
    .state('archive', {
      url: '/archivio',
      templateUrl: '/js/views/archive.html',
      controller: 'ArchiveCtrl',
      controllerAs: 'archive',
      resolve: {
        loginRequired: loginRequired
      }
    });

  loginRequired.$inject = ['$q', '$location', 'CurrentUserService', '$rootScope'];
  async function loginRequired($q, $location, CurrentUserService, $rootScope) {
    try {
      const user = await CurrentUserService.getUser();
      if (!user) {
        $rootScope.$broadcast('loggedOut');
        // return $q.reject('Not Authorized');
      } else {
        $rootScope.$broadcast('loggedIn');
      }
    } catch (e) {
      return $q.reject('Not Authorized');
    }
  }

  $urlRouterProvider.otherwise('/');
}
