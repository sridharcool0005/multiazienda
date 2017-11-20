angular.module('multiazienda').controller('ClientsIndexCtrl', ClientsIndexCtrl);

ClientsIndexCtrl.$inject = [
  'Client',
  'filterFilter',
  '$scope',
  '$window',
  'CommonService'
];

function ClientsIndexCtrl(
  Client,
  filterFilter,
  $scope,
  $window,
  CommonService
) {
  const vm = this;

  vm.q = '';
  vm.cognome = '';
  vm.zona = '';
  vm.tipologiaAttivita = '';
  vm.searching = false;
  vm.clearSearch = clearSearch;
  vm.expandFilters = expandFilters;
  vm.showingFilters = CommonService.showFilters();
  if (!$scope.$$phase) $scope.$apply();

  Client.query().$promise.then(clients => {
    vm.clients = clients;
    filterClients();
  });

  function filterClients() {
    const params = {
      nome: vm.q,
      cognome: vm.cognome,
      zona: {
        name: vm.zona
      },
      tipologiaAttivita: {
        name: vm.tipologiaAttivita
      }
    };

    vm.filtered = filterFilter(vm.clients, params);
    if (
      vm.q === '' &&
      vm.cognome === '' &&
      vm.zona === '' &&
      vm.tipologiaAttivita === ''
    ) {
      vm.searching = false;
    } else {
      vm.searching = true;
    }
  }

  $scope.$watchGroup(
    [() => vm.q, () => vm.cognome, () => vm.zona, () => vm.tipologiaAttivita],
    filterClients
  );

  function clearSearch() {
    vm.q = '';
    vm.cognome = '';
    vm.zona = '';
    vm.tipologiaAttivita = '';
  }

  $window.addEventListener('resize', () => {
    vm.showingFilters = CommonService.showFilters();
    if (!$scope.$$phase) $scope.$apply();
  });

  function expandFilters() {
    if ($window.innerWidth < 576) {
      vm.showingFilters
        ? (vm.showingFilters = false)
        : (vm.showingFilters = true);
    }
  }
}
