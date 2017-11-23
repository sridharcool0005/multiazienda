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
  vm.zoneString = '';
  vm.typeString = '';
  vm.searching = false;
  vm.clearSearch = clearSearch;
  vm.expandFilters = expandFilters;
  vm.showingFilters = CommonService.showFilters();
  if (!$scope.$$phase) $scope.$apply();

  Client.query().$promise.then(clients => {
    vm.clients = clients;
    for (var i = 0; i < clients.length; i++) {
      if (!vm.clients[i].zoneString) {
        vm.clients[i].zoneString = '';
        const zone = clients[i].zona;
        for (var j = 0; j < zone.length; j++) {
          vm.clients[i].zoneString += ` ${zone[j].name}`;
        }
      }

      if (!vm.clients[i].typeString) {
        vm.clients[i].typeString = '';
        const type = clients[i].tipologiaAttivita;
        for (var k = 0; k < type.length; k++) {
          vm.clients[i].typeString += ` ${type[k].name}`;
        }
      }
    }
    filterClients();
  });

  function filterClients() {
    const params = {
      nome: vm.q,
      cognome: vm.cognome,
      zoneString: vm.zoneString,
      typeString: vm.typeString
      // zona: {
      //   name: vm.zona
      // },
      // tipologiaAttivita: {
      //   name: vm.tipologiaAttivita
      // }
    };

    vm.filtered = filterFilter(vm.clients, params);
    if (
      vm.q === '' &&
      vm.cognome === '' &&
      vm.zoneString === '' &&
      vm.typeString === ''
      // vm.zona === '' &&
      // vm.tipologiaAttivita === ''
    ) {
      vm.searching = false;
    } else {
      vm.searching = true;
    }
  }

  $scope.$watchGroup(
    [
      () => vm.q,
      () => vm.cognome,
      () => vm.zoneString,
      () => vm.typeString
      // () => vm.zona, () => vm.tipologiaAttivita
    ],
    filterClients
  );

  function clearSearch() {
    vm.q = '';
    vm.cognome = '';
    vm.zoneString = '';
    vm.typeString = '';
    // vm.tipologiaAttivita = '';
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
