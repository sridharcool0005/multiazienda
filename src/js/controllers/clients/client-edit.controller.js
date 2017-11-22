angular.module('multiazienda').controller('ClientEditCtrl', ClientEditCtrl);

ClientEditCtrl.$inject = [
  'Client',
  'Type',
  'Zone',
  'Location',
  '$window',
  '$stateParams',
  '$http',
  '$state',
  '$rootScope'
];

function ClientEditCtrl(
  Client,
  Type,
  Zone,
  Location,
  $window,
  $stateParams,
  $http,
  $state,
  $rootScope
) {
  const vm = this;

  vm.searchAddress = searchAddress;
  vm.chooseAddress = chooseAddress;
  vm.clear = clear;
  vm.cancel = cancel;
  vm.showForm = showForm;
  vm.clientSubmit = clientEdit;
  vm.typeIds = [];
  vm.zoneIds = [];
  vm.addTypeSelection = addTypeSelection;
  vm.addZoneSelection = addZoneSelection;
  vm.wasLocationDeleted = false;
  vm.inClientNew = false;

  fetchTypes();
  fetchZones();

  $rootScope.$on('zones added', () => {
    fetchZones();
  });

  $rootScope.$on('types added', () => {
    fetchTypes();
  });

  Client.get({ id: $stateParams.id }).$promise.then(client => {
    vm.client = client;
    vm.results = client.indirizzo.id;
    vm.random = {
      searchAddress: vm.client.indirizzo.addressFormatted
    };
    vm.location = {
      locationId: vm.client.indirizzo.locationId,
      addressFormatted: vm.client.indirizzo.addressFormatted,
      lat: vm.client.indirizzo.lat,
      lng: vm.client.indirizzo.lng,
      type: 'street address'
    };

    // check if type selected
    checkIfTypeSelected(client);
    // check if zone selected
    checkIfZoneSelected(client);
  });

  function checkIfTypeSelected(client) {
    const selectedType = document.getElementById('tipologiaAttivita').options;
    for (var i = 0; i < client.tipologiaAttivita.length; i++) {
      vm.typeIds.push(client.tipologiaAttivita[i].id);
    }
    for (var j = 0; j < selectedType.length; j++) {
      if (vm.typeIds.includes(selectedType[j].value)) {
        selectedType[j].selected = true;
      }
    }
  }

  function checkIfZoneSelected(client) {
    const selectedZone = document.getElementById('zona').options;
    for (var k = 0; k < client.zona.length; k++) {
      vm.zoneIds.push(client.zona[k].id);
    }
    for (var l = 0; l < selectedZone.length; l++) {
      if (vm.zoneIds.includes(selectedZone[l].value)) {
        selectedZone[l].selected = true;
      }
    }
  }

  function fetchTypes() {
    Type.query().$promise.then(types => (vm.types = types));
  }

  function fetchZones() {
    Zone.query().$promise.then(zones => (vm.zones = zones));
  }

  function searchAddress() {
    const address = document.getElementById('searchAddress').value;

    if (address.length > 0) {
      vm.errorMessage = null;
      $http
        .get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${address.replace(
            / /g,
            '+'
          )}&region=it&key=AIzaSyDuvV2-lIr6kqI6Y3LrnhItDlSERzaL_R4`
        )
        .then(response => {
          showForm('address');
          vm.results = response.data.results;
        })
        .then(() => (document.getElementById('searchAddress').value = ''));
    } else {
      vm.results = null;
      vm.errorMessage = 'Please start typing an address first';
    }
  }

  function chooseAddress(index) {
    vm.wasLocationDeleted = true;
    const chosenAddress = vm.results[index];
    vm.location = {
      locationId: chosenAddress.place_id,
      addressFormatted: chosenAddress.formatted_address,
      lat: chosenAddress.geometry.location.lat,
      lng: chosenAddress.geometry.location.lng,
      type: 'street address'
    };

    vm.results = null;

    showForm('address');
  }

  function clear(input) {
    vm.client[input] = '';
  }

  function cancel() {
    if (!vm.wasLocationDeleted) {
      Location.delete({ id: vm.client.indirizzo.id })
        .$promise.then(() => {
          vm.results = null;
          vm.random = {};

          if (vm.location) {
            vm.location = null;
          }
        })
        .catch(err => console.log(err));
    } else {
      if (vm.location) {
        return (vm.location = null);
      }
    }
  }

  function showForm(which) {
    $rootScope.$broadcast('showing modal', {
      which: which
    });
  }

  function clientEdit() {
    if (vm.clientForm.$valid) {
      if (vm.wasLocationDeleted) {
        Location.save(vm.location).$promise.then(location => {
          vm.client.indirizzo = location.id;
          vm.client.zona = vm.zoneIds;
          vm.client.tipologiaAttivita = vm.typeIds;

          Client.update({ id: $stateParams.id }, vm.client).$promise.then(
            client => {
              $state.go('clientShow', { id: client.id });
            }
          );
        });
      } else {
        vm.client.indirizzo = location.id;
        vm.client.zona = vm.zoneIds;
        vm.client.tipologiaAttivita = vm.typeIds;

        Client.update({ id: $stateParams.id }, vm.client).$promise.then(
          client => {
            $state.go('clientShow', { id: client.id });
          }
        );
      }
    }
  }

  function addTypeSelection() {
    vm.typeIds = [];
    const selectInput = document.getElementById('tipologiaAttivita').options;
    for (var i = 0; i < selectInput.length; i++) {
      const option = selectInput[i];
      if (option.selected) {
        if (!vm.typeIds.includes(option.value)) {
          vm.typeIds.push(option.value);
        } else {
          const index = vm.typeIds.indexOf(option.value);
          vm.typeIds.splice(index, 1);
        }
      }
    }
    console.log(vm.typeIds);
  }

  function addZoneSelection() {
    vm.zoneIds = [];
    const selectInput = document.getElementById('zona').options;
    for (var i = 0; i < selectInput.length; i++) {
      const option = selectInput[i];
      if (option.selected) {
        if (!vm.zoneIds.includes(option.value)) {
          vm.zoneIds.push(option.value);
        } else {
          const index = vm.zoneIds.indexOf(option.value);
          vm.zoneIds.splice(index, 1);
        }
      }
    }
    console.log(vm.zoneIds);
  }
}
