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
  // vm.tipologiaAttivita = '';
  vm.searching = false;
  vm.clearSearch = clearSearch;
  vm.expandFilters = expandFilters;
  vm.showingFilters = CommonService.showFilters();
  if (!$scope.$$phase) $scope.$apply();

  Client.query().$promise.then(clients => {
    console.log(clients);
    vm.clients = clients;
    filterClients();
  });

  function filterClients() {
    const params = {
      nome: vm.q,
      cognome: vm.cognome
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
      vm.cognome === ''
      // vm.zona === '' &&
      // vm.tipologiaAttivita === ''
    ) {
      vm.searching = false;
    } else {
      vm.searching = true;
    }
    console.log(vm.filtered);
  }

  $scope.$watchGroup(
    [
      () => vm.q,
      () => vm.cognome
      // () => vm.zona, () => vm.tipologiaAttivita
    ],
    filterClients
  );

  // vm.filterZone = filterZone;
  // function filterZone() {
  //   // console.log(vm.filtered, vm.zona);
  //   for (var i = 0; i < vm.filtered.length; i++) {
  //     const singleResult = vm.filtered[i].zona;
  //     console.log('SINGLERESULT ==>', singleResult);
  //     const contains = [];
  //     for (var j = 0; j < singleResult.length; j++) {
  //       const zone = `${singleResult[j].name}`;
  //       const lowerZone = zone.toLowerCase();
  //       console.log(lowerZone);
  //       contains.push(lowerZone.includes(vm.zona));
  //     }
  //     if (!contains.includes(true)) {
  //       vm.filtered.splice(i, 1);
  //     }
  //   }
  // }

  function clearSearch() {
    vm.q = '';
    vm.cognome = '';
    vm.zona = '';
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
