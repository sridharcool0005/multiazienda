angular.module('multiazienda').controller('ArchiveCtrl', ArchiveCtrl);

ArchiveCtrl.$inject = ['Client', 'Bar', '$stateParams', '$q'];

function ArchiveCtrl(Client, Bar, $stateParams, $q) {
  const vm = this;

  vm.toggleView = toggleView;
  toggleView($stateParams.clientOrBar);

  $q
    .all({
      clients: Client.getArchived().$promise,
      bars: Bar.getArchived().$promise
    })
    .then(data => {
      vm.barArchived = data.bars;
      vm.clientArchived = data.clients;
    });

  function toggleView(toggleWhat) {
    if (toggleWhat === 'clients') {
      // hide bars and show clients
      vm.toggleBars = false;
      vm.toggleClients = true;
    } else {
      // hide clients and show bars
      vm.toggleBars = true;
      vm.toggleClients = false;
    }
  }
}
