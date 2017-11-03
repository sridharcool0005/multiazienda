angular
  .module('multiazienda')
  .controller('ArchiveCtrl', ArchiveCtrl);

ArchiveCtrl.$inject = ['Client', 'Bar'];

function ArchiveCtrl(Client, Bar) {
  const vm = this;

  vm.toggleView = toggleView;
  vm.toggleBars = true;
  vm.toggleClients = false;
  
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
