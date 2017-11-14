angular
  .module('multiazienda')
  .controller('ClientShowCtrl', ClientShowCtrl);

ClientShowCtrl.$inject = ['Client', 'Bar', '$stateParams', '$window', 'CurrentUserService', '$state', '$scope', 'CommonService', '$rootScope'];

function ClientShowCtrl(Client, Bar, $stateParams, $window, CurrentUserService, $state, $scope, CommonService, $rootScope) {
  const vm = this;

  vm.orderBy = 'data';
  vm.attivitaVisteIds = [];
  vm.filteredBars = [];
  vm.addComment = comment;
  vm.deleteComment = deleteComm;
  vm.archive = archive;
  vm.expandFilters = expandFilters;
  // vm.copyToClipboard = copyToClipboard;
  fetchClient();

  function fetchClient() {
    Client
      .get({ id: $stateParams.id })
      .$promise
      .then(client => {
        vm.client = client;
        vm.center = { lat: client.indirizzo.lat, lng: client.indirizzo.lng };
        for (var i = 0; i < vm.client.attivitaViste.length; i++) {
          vm.attivitaVisteIds.push(`${vm.client.attivitaViste[i].bar.id}`);
        }
      })
      .then(() => {
        if (vm.client.importoInvestimento && vm.client.importoInvestimento.anticipo) {
          vm.anticipo = vm.client.importoInvestimento.anticipo;
        } else {
          vm.anticipo = '';
        }
        Bar
          .query()
          .$promise
          .then(bars => {
            for (var i = 0; i < bars.length; i++) {
              const bar = bars[i];
              if (bar.richiestaTotale&& bar.richiestaTotale.contanti) {
                if (parseFloat(bar.richiestaTotale.contanti) === parseFloat(vm.anticipo)) { // only query the bars who match between richiestaTotale and anticipo
                  if(!vm.attivitaVisteIds.includes(`${bar.id}`) && `${bar.tipologiaAttivita.name}` === `${vm.client.tipologiaAttivita.name}`) vm.filteredBars.push(bar);
                }
              }
            }
          });
      });
  }

  // $timeout(() => {
  //   var copyEmailBtn = document.querySelector('.copia-btn');
  //   copyEmailBtn.addEventListener('click', function(event) {
  //     // Select the email link anchor text
  //     var emailLink = document.querySelector('#copyEmail');
  //     console.log(emailLink);
  //     emailLink.select();
  //     // var range = document.createRange();
  //     // range.selectNode(emailLink);
  //     // $window.getSelection().addRange(range);
  //
  //     try {
  //       // Now that we've selected the anchor text, execute the copy command
  //       var successful = document.execCommand('copy');
  //       var msg = successful ? 'successful' : 'unsuccessful';
  //       console.log('Copy email command was ' + msg + successful);
  //     } catch(err) {
  //       console.log('Oops, unable to copy');
  //     }
  //
  //     $window.getSelection().removeAllRanges();
  //   });
  // }, 50);

  function comment() {
    if (vm.commentForm.$valid) {
      Client
        .addComment({ id: $stateParams.id }, vm.comment)
        .$promise
        .then(() => {
          vm.comment = '';
          vm.client = Client.get({ id: $stateParams.id });
        });
    }
  }

  function deleteComm(comment) {
    Client
      .deleteComment({ id: $stateParams.id, commentId: comment._id })
      .$promise
      .then(() => {
        Client
          .get({ id: $stateParams.id })
          .$promise
          .then(client => vm.client = client);
      });
  }

  function archive(addOrRemove) {
    Client
      .archiveClient({ id: $stateParams.id }, vm.client)
      .$promise
      .then(() => {
        if (addOrRemove === 'aggiungi') {
          $rootScope.$broadcast('archiving client');
          $state.go('archive');
        } else {
          $state.go('ClientsIndex');
        }
      });
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
