angular
  .module('multiazienda')
  .controller('BarsIndexCtrl', BarsIndexCtrl);

BarsIndexCtrl.$inject = ['Bar', 'filterFilter', '$scope'];

function BarsIndexCtrl(Bar, filterFilter, $scope) {
  const vm = this;

  Bar
    .query()
    .$promise
    .then(bars => {
      vm.bars = bars;
      filterBars();
    });

  vm.q = '';
  vm.zona = '';
  vm.tipologiaAttivita = '';
  vm.searching = false;
  vm.clearSearch = clearSearch;

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
}
