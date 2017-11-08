angular
  .module('multiazienda')
  .controller('ClientShowCtrl', ClientShowCtrl);

ClientShowCtrl.$inject = ['Client', 'Bar', '$stateParams', '$window', 'CurrentUserService', '$state', '$scope'];

function ClientShowCtrl(Client, Bar, $stateParams, $window, CurrentUserService, $state, $scope) {
  const vm = this;

  vm.orderBy = 'data';
  vm.attivitaVisteIds = [];
  vm.filteredBars = [];
  vm.addComment = comment;
  vm.deleteComment = deleteComm;
  vm.archive = archive;

  Client
    .get({ id: $stateParams.id })
    .$promise
    .then(client => {
      console.log('first promise');
      vm.client = client;
      for (var i = 0; i < vm.client.attivitaViste.length; i++) {
        vm.attivitaVisteIds.push(`${vm.client.attivitaViste[i].bar.id}`);
      }
      if (client.indirizzo) {
        vm.icon = {
          url: 'https://image.flaticon.com/icons/svg/33/33622.svg',
          scaledSize: new $window.google.maps.Size(50, 50)
        };
      }
    })
    .then(() => {
      console.log('second promise');
      console.log(vm.client.indirizzo);
      if (vm.client.indirizzo.lat) {
        console.log('it has an address');
        const map = new $window.google.maps.Map(document.getElementById('google-map'), {
          zoom: 14,
          center: { lat: vm.client.indirizzo.lat, lng: vm.client.indirizzo.lng },
          scrollwheel: false,
          styles: [
            { 'elementType': 'geometry', 'stylers': [{ 'saturation': -100 }]},
            { 'elementType': 'labels.text.stroke', 'stylers': [{'color': '#FFFFFF'}]},
            { 'elementType': 'labels.text.fill', 'stylers': [{'color': '#242f3e'}]}
          ]
        });

        new $window.google.maps.Marker({
          position: { lat: vm.client.indirizzo.lat, lng: vm.client.indirizzo.lng },
          map: map,
          title: 'Hello world',
          icon: vm.icon,
          animation: $window.google.maps.Animation.DROP
        });
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

  function comment() {
    const user = CurrentUserService.currentUser.id;
    vm.comment.createdBy = user;

    Client
      .addComment({ id: $stateParams.id }, vm.comment)
      .$promise
      .then(() => {
        vm.comment = '';
        vm.client = Client.get({ id: $stateParams.id });
      });
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

  function archive() {
    Client
      .archiveClient({ id: $stateParams.id }, vm.client)
      .$promise
      .then(() => $state.go('clientsIndex'));
  }
}
