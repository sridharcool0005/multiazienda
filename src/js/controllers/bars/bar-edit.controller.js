angular
  .module('multiazienda')
  .controller('BarEditCtrl', BarEditCtrl);

BarEditCtrl.$inject = ['Bar', 'Type', 'Zone', '$stateParams', '$state', '$window', '$rootScope'];

function BarEditCtrl(Bar, Type, Zone, $stateParams, $state, $window, $rootScope) {
  const vm = this;

  vm.barSubmit = barEdit;
  vm.inNew = false;
  vm.clear = clear;
  vm.showForm = showForm;
  fetchTypes();
  fetchZones();

  $rootScope.$on('zones added', () => {
    fetchZones();
  });

  $rootScope.$on('types added', () => {
    fetchTypes();
  });

  Bar
    .get({ id: $stateParams.id })
    .$promise
    .then(bar => vm.bar = bar);

  function barEdit() {
    if (vm.barForm.$invalid) {
      $window.scrollTo(0, 0);
    }
    if (vm.barForm.$valid) {
      Bar
        .update({ id: $stateParams.id }, vm.bar)
        .$promise
        .then(() => {
          $state.go('barsIndex');
        });
    }
  }

  function clear(input) {
    if (input.includes('.')) {
      const decomposed = input.split('.');
      vm.bar[decomposed[0]][decomposed[1]] = '';
    } else {
      vm.bar[input] = '';
    }
  }

  function showForm(which) {
    $rootScope.$broadcast('showing modal', {
      which: which
    });
  }

  function fetchTypes() {
    Type
      .query()
      .$promise
      .then(types => vm.types = types);
  }

  function fetchZones() {
    Zone
      .query()
      .$promise
      .then(zones => vm.zones = zones);
  }
}
