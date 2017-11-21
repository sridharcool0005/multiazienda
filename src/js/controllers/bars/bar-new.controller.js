angular.module('multiazienda').controller('BarNewCtrl', BarNewCtrl);

BarNewCtrl.$inject = [
  'Type',
  'Zone',
  'Location',
  'Bar',
  '$state',
  '$rootScope',
  '$scope',
  '$window',
  '$timeout'
];

function BarNewCtrl(
  Type,
  Zone,
  Location,
  Bar,
  $state,
  $rootScope,
  $scope,
  $window,
  $timeout
) {
  const vm = this;
  vm.changePhoto = changePhoto;
  vm.startCounter = 0;
  vm.barSubmit = barNew;
  vm.clear = clear;
  vm.showForm = showForm;
  vm.inNew = true;
  vm.checkDuplicateCode = checkDuplicateCode;
  vm.received = false;
  const codes = [];
  fetchTypes();
  fetchZones();

  Bar.query().$promise.then(bars => {
    bars.forEach(bar => {
      codes.push(bar.codiceAttivita);
    });
  });

  $rootScope.$on('zones added', () => {
    fetchZones();
  });

  $rootScope.$on('types added', () => {
    fetchTypes();
  });

  $rootScope.$on('no place', function(event, args) {
    // console.log('received', args);
    vm.received = true;
    vm.disabled = false;
    document
      .getElementById('no-place-found-btn')
      .addEventListener('click', () => {
        vm.photoArray = args.photoArray;

        vm.location = {
          locationId: args.locationId
        };

        vm.bar = {
          denominazioneAttivita: args.denominazioneAttivita,
          fotoAttivita: args.photoArray[0],
          locationId: args.locationId
        };
        vm.received = false;
        $scope.$apply();
      });
    $scope.$apply();
  });

  $rootScope.$on('new place', function(event, args) {
    vm.received = false;
    vm.disabled = true;
    vm.photoArray = args.photoArray;

    vm.location = {
      locationId: args.locationId,
      addressHTML: args.addressHTML,
      addressFormatted: args.addressFormatted,
      lat: args.lat,
      lng: args.lng,
      url: args.url
    };

    vm.bar = {
      denominazioneAttivita: args.name,
      fotoAttivita: args.photoArray[0],
      locationId: args.locationId,
      website: args.website
    };

    $scope.$apply();
  });

  function checkDuplicateCode() {
    if (codes.includes(vm.bar.codiceAttivita)) {
      vm.barForm.codiceAttivita.$setValidity('unique', false);
      vm.barForm.codiceAttivita.$error.unique = false;
    } else {
      vm.barForm.codiceAttivita.$setValidity('unique', true);
      vm.barForm.codiceAttivita.$error.unique = true;
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

  function changePhoto(direction) {
    if (direction === 'prev' && vm.startCounter >= 0) {
      vm.bar.fotoAttivita = vm.photoArray[vm.startCounter - 1];
      vm.startCounter -= 1;
    } else if (
      direction === 'next' &&
      vm.startCounter <= vm.photoArray.length - 1
    ) {
      vm.bar.fotoAttivita = vm.photoArray[vm.startCounter + 1];
      vm.startCounter += 1;
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
