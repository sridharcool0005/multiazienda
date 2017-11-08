angular
  .module('multiazienda')
  .controller('BarsIndexCtrl', BarsIndexCtrl);

BarsIndexCtrl.$inject = ['Bar', 'filterFilter', '$scope', '$window', 'CommonService'];

function BarsIndexCtrl(Bar, filterFilter, $scope, $window, CommonService) {
  const vm = this;

  vm.q = '';
  vm.zona = '';
  vm.tipologiaAttivita = '';
  vm.searching = false;
  vm.clearSearch = clearSearch;
  vm.expandFilters = expandFilters;

  Bar
    .query()
    .$promise
    .then(bars => {
      vm.bars = bars;
      filterBars();
    });

  function filterBars(){
    const params = {
      denominazioneAttivita: vm.q,
      zona: {
        name: vm.zona
      },
      tipologiaAttivita: {
        name: vm.tipologiaAttivita
      }
    };
    vm.filtered = filterFilter(vm.bars, params);
    if (vm.q === '' && vm.zona === '' && vm.tipologiaAttivita === '') {
      vm.searching = false;
    } else {
      vm.searching = true;
    }
  }

  $scope.$watchGroup([
    () => vm.q,
    () => vm.zona,
    () => vm.tipologiaAttivita
  ], filterBars);

  function clearSearch() {
    vm.q = '';
    vm.zona = '';
    vm.tipologiaAttivita = '';
  }

  $window.addEventListener('resize', () => {
    vm.showingFilters = CommonService.showFilters();
    vm.smallDevices = CommonService.smallDevices();
    if(!$scope.$$phase) $scope.$apply();
  });

  vm.showingFilters = CommonService.showFilters();
  vm.smallDevices = CommonService.smallDevices();
  if(!$scope.$$phase) $scope.$apply();

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
