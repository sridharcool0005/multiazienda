angular.module('multiazienda').controller('BarNewCtrl', BarNewCtrl);

BarNewCtrl.$inject = [
  'Type',
  'Zone',
  'Location',
  'Bar',
  '$state',
  '$rootScope',
  '$scope',
  '$window'
];

function BarNewCtrl(
  Type,
  Zone,
  Location,
  Bar,
  $state,
  $rootScope,
  $scope,
  $window
) {
  const vm = this;
  vm.changePhoto = changePhoto;
  let startCounter = 0;
  vm.barSubmit = barNew;
  vm.clear = clear;
  vm.showForm = showForm;
  vm.inNew = true;
  fetchTypes();
  fetchZones();

  $rootScope.$on('zones added', () => {
    fetchZones();
  });

  $rootScope.$on('types added', () => {
    fetchTypes();
  });

  $rootScope.$on('new place', function(event, args) {
    vm.photoArray = args.photoArray;

    vm.location = {
      locationId: args.locationId,
      addressHTML: args.addressHTML,
      addressFormatted: args.addressFormatted,
      lat: args.lat,
      lng: args.lng
    };

    vm.bar = {
      denominazioneAttivita: args.name,
      fotoAttivita: args.photoArray[0],
      locationId: args.locationId,
      website: args.website
    };

    $scope.$apply();
  });

  function clear(input) {
    if (input.includes('.')) {
      const decomposed = input.split('.');
      vm.bar[decomposed[0]][decomposed[1]] = '';
    } else {
      vm.bar[input] = '';
    }
  }

  function changePhoto() {
    if (startCounter < vm.photoArray.length - 1) {
      vm.bar.fotoAttivita = vm.photoArray[startCounter + 1];
      startCounter += 1;
    } else {
      vm.bar.fotoAttivita = vm.photoArray[0];
      startCounter = 1;
    }
  }

  function barNew() {
    if (vm.barForm.$invalid) {
      $window.scrollTo(0, 0);
    }
    if (vm.barForm.$valid) {
      Location.save(vm.location)
        .$promise.then(location => {
          vm.bar.indirizzo = location.id;
          vm.bar.locationId = location.locationId;
        })
        .then(() => {
          return Bar.save(vm.bar);
        })
        .then(() => {
          $state.go('barsIndex');
        })
        .catch(() => {
          $window.scrollTo(0, 0);
          $rootScope.$broadcast('displayMessage', {
            type: 'danger',
            content: "Attenzione: l'attivita e gia esistente"
          });
        });
    }
  }

  function showForm(which) {
    $rootScope.$broadcast('showing modal', {
      which: which
    });
  }

  function fetchTypes() {
    Type.query().$promise.then(types => (vm.types = types));
  }

  function fetchZones() {
    Zone.query().$promise.then(zones => (vm.zones = zones));
  }
}
