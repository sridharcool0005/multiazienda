angular
  .module('multiazienda')
  .controller('ArchiveCtrl', ArchiveCtrl);

ArchiveCtrl.$inject = ['Client', 'Bar', '$rootScope'];

function ArchiveCtrl(Client, Bar, $rootScope) {
  const vm = this;

  vm.toggleView = toggleView;
  vm.toggleBars = true;
  vm.toggleClients = false;

  $rootScope.$on('archiving client', () => {
    console.log('archiving clients message');
    vm.toggleClients = true;
    vm.toggleBars = false;
  });

  $rootScope.$on('archiving bars', () => {
    console.log('archiving bars message');
    vm.toggleClients = false;
    vm.toggleBars = true;
  });

  Client
    .getArchived()
    .$promise
    .then(archived => {
      vm.clientArchived = archived;
    });

  Bar
    .getArchived()
    .$promise
    .then(archived => {
      vm.barArchived = archived;
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
