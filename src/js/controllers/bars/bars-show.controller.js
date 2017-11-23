angular.module('multiazienda').controller('BarShowCtrl', BarShowCtrl);

BarShowCtrl.$inject = [
  'Bar',
  'Client',
  '$stateParams',
  '$window',
  'CurrentUserService',
  '$state',
  '$rootScope',
  '$timeout'
];

function BarShowCtrl(
  Bar,
  Client,
  $stateParams,
  $window,
  CurrentUserService,
  $state,
  $rootScope,
  $timeout
) {
  const vm = this;

  vm.potentialClients = [];
  vm.addComment = comment;
  vm.deleteComment = deleteComm;
  vm.archive = archive;
  vm.expandDetails = expandDetails;
  vm.expandedDetails = false;

  Bar.get({ id: $stateParams.id })
    .$promise.then(bar => {
      vm.bar = bar;
      vm.center = { lat: bar.indirizzo.lat, lng: bar.indirizzo.lng };
      vm.title = `Indirizzo dell'attivita ${bar.denominazioneAttivita}`;
      vm.content = `
        <div class="info-window">
          <a class="maps-link" href="${bar.indirizzo.url}" target="_blank">
            APRI SU GOOGLE MAPS
            <i class="fa fa-external-link" aria-hidden="true"></i>
          </a>
        </div>
        `;

      calculateMapHeight();
    })
    .then(() => {
      Client.query()
        .$promise.then(clients => {
          if (vm.bar.richiestaTotale && vm.bar.richiestaTotale.contanti) {
            vm.richiestaContanti = vm.bar.richiestaTotale.contanti;
          } else {
            vm.richiestaContanti = '';
          }

          vm.clients = clients;
          vm.clientsWhoHaveSeen = [];
          for (var i = 0; i < vm.bar.clienti.length; i++) {
            vm.clientsWhoHaveSeen.push(`${vm.bar.clienti[i].id}`);
          }
        })
        .then(() => {
          for (var i = 0; i < vm.clients.length; i++) {
            const client = vm.clients[i];
            client.typeStringArray = client.typeString.split(', ');
            if (
              client.importoInvestimento &&
              client.importoInvestimento.anticipo
            ) {
              if (
                !vm.clientsWhoHaveSeen.includes(`${client.id}`) &&
                parseFloat(vm.richiestaContanti) ===
                  parseFloat(client.importoInvestimento.anticipo) &&
                client.typeStringArray.includes(
                  `${vm.bar.tipologiaAttivita.name}`
                )
              ) {
                vm.potentialClients.push(client);
              }
            }
          }
        });
    });

  function calculateMapHeight() {
    $timeout(() => {
      if (vm.bar.indirizzo) {
        if (vm.bar.indirizzo.lat) {
          const mapDivHeight =
            300 - document.getElementById('indirizzo').offsetHeight;
          document.getElementsByClassName('details-map')[0].style.height = `${
            mapDivHeight
          }px`;
        } else {
          document.getElementById('indirizzo').style.height = '300px';
        }
      } else {
        document.getElementById('indirizzo').style.height = '300px';
      }
    }, 50);
  }

  function comment() {
    if (vm.commentForm.$valid) {
      const user = CurrentUserService.currentUser.id;
      vm.comment.createdBy = user;

      Bar.addComment({ id: $stateParams.id }, vm.comment).$promise.then(() => {
        vm.comment = {};
        vm.commentForm.$setPristine();
        vm.bar = Bar.get({ id: $stateParams.id });
      });
    }
  }

  function deleteComm(comment) {
    Bar.deleteComment({
      id: $stateParams.id,
      commentId: comment._id
    }).$promise.then(() => {
      Bar.get({ id: $stateParams.id }).$promise.then(bar => (vm.bar = bar));
    });
  }

  function archive(addOrRemove) {
    Bar.archiveBar({ id: $stateParams.id }, vm.bar).$promise.then(() => {
      if (addOrRemove === 'aggiungi') {
        $state.go('archive', { clientOrBar: 'bars' });
      } else {
        $state.go('barsIndex');
      }
    });
  }

  function expandDetails() {
    vm.expandedDetails
      ? (vm.expandedDetails = false)
      : (vm.expandedDetails = true);
  }
}
