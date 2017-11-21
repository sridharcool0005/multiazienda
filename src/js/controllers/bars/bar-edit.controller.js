angular.module('multiazienda').controller('BarEditCtrl', BarEditCtrl);

BarEditCtrl.$inject = [
  'Bar',
  'Type',
  'Zone',
  'Location',
  '$q',
  '$stateParams',
  '$state',
  '$window',
  '$rootScope'
];

function BarEditCtrl(
  Bar,
  Type,
  Zone,
  Location,
  $q,
  $stateParams,
  $state,
  $window,
  $rootScope
) {
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

  Bar.get({ id: $stateParams.id })
    .$promise.then(bar => {
      vm.bar = bar;
      return Location.get({ id: bar.indirizzo.id });
    })
    .then(location => (vm.location = location))
    .catch(err => {
      $rootScope.$broadcast('error', err);
    });

  function barEdit() {
    if (vm.barForm.$invalid) {
      $window.scrollTo(0, 0);
    }
    if (vm.barForm.$valid) {
      Bar.update({ id: $stateParams.id }, vm.bar)
        .$promise.then(() => {
          return Location.update({ id: vm.bar.indirizzo.id }, vm.location);
        })
        .then(() => {
          $state.go('barsIndex');
        })
        .catch(() => {
          $rootScope.$broadcast('displayMessage', {
            type: 'danger',
            message: 'Non e stato possibile aggiornare il bar'
          });
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
    Type.query()
      .$promise.then(types => (vm.types = types))
      .catch(err => {
        $rootScope.$broadcast('error', err);
      });
  }

  function fetchZones() {
    Zone.query()
      .$promise.then(zones => (vm.zones = zones))
      .catch(err => {
        $rootScope.$broadcast('error', err);
      });
  }
}
