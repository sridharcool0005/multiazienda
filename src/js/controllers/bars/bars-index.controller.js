angular.module('multiazienda').controller('BarsIndexCtrl', BarsIndexCtrl);

BarsIndexCtrl.$inject = [
  'Bar',
  'Zone',
  'Type',
  'filterFilter',
  '$scope',
  '$window',
  'CommonService'
];

function BarsIndexCtrl(
  Bar,
  Zone,
  Type,
  filterFilter,
  $scope,
  $window,
  CommonService
) {
  const vm = this;

  vm.q = '';
  vm.zona = '';
  vm.tipologiaAttivita = '';
  vm.codiceAttivita = '';
  vm.searching = false;
  vm.clearSearch = clearSearch;
  vm.expandFilters = expandFilters;
  vm.orderByField = 'codiceAttivita';
  vm.reverseSort = false;

  Type.query().$promise.then(types => {
    vm.types = types;
    console.log(types);
  });

  vm.zones = Zone.query();
  Bar.query().$promise.then(bars => {
    vm.bars = bars;
    filterBars();
  });

  function filterBars() {
    const params = {
      codiceAttivita: vm.codiceAttivita,
      denominazioneAttivita: vm.q,
      zona: {
        name: vm.zona.name
      },
      tipologiaAttivita: {
        name: vm.tipologiaAttivita.name
      }
    };
    vm.filtered = filterFilter(vm.bars, params);
    if (
      vm.q === '' &&
      vm.zona === '' &&
      vm.tipologiaAttivita === '' &&
      vm.codiceAttivita === ''
    ) {
      vm.searching = false;
    } else {
      vm.searching = true;
    }
  }

  $scope.$watchGroup(
    [
      () => vm.q,
      () => vm.zona,
      () => vm.tipologiaAttivita,
      () => vm.codiceAttivita
    ],
    filterBars
  );

  function clearSearch() {
    vm.q = '';
    vm.zona = '';
    vm.tipologiaAttivita = '';
    vm.codiceAttivita = '';
  }

  $window.addEventListener('resize', () => {
    vm.showingFilters = CommonService.showFilters();
    vm.smallDevices = CommonService.smallDevices();
    if (!$scope.$$phase) $scope.$apply();
  });

  vm.showingFilters = CommonService.showFilters();
  vm.smallDevices = CommonService.smallDevices();
  if (!$scope.$$phase) $scope.$apply();

  function expandFilters() {
    if ($window.innerWidth < 576) {
      if (vm.showingFilters) {
        vm.showingFilters = false;
      } else {
        vm.showingFilters = true;
      }
    }
  }
}
