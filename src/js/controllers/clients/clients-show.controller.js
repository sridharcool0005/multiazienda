angular.module('multiazienda').controller('ClientShowCtrl', ClientShowCtrl);

ClientShowCtrl.$inject = [
  'Client',
  'Bar',
  '$stateParams',
  '$window',
  'CurrentUserService',
  '$timeout',
  '$state',
  '$scope',
  '$q',
  'CommonService',
  '$rootScope'
];

function ClientShowCtrl(
  Client,
  Bar,
  $stateParams,
  $window,
  CurrentUserService,
  $timeout,
  $state,
  $scope,
  $q,
  CommonService,
  $rootScope
) {
  const vm = this;

  vm.orderBy = 'data';
  vm.attivitaVisteIds = [];
  vm.filteredBars = [];
  vm.addComment = comment;
  vm.deleteComment = deleteComm;
  vm.archive = archive;
  vm.expandFilters = expandFilters;
  vm.showingFilters = CommonService.showFilters();
  vm.smallDevices = CommonService.smallDevices();
  if (!$scope.$$phase) $scope.$apply();
  let bars = null;
  fetchClient();

  function fetchClient() {
    $q
      .all({
        client: Client.get({ id: $stateParams.id }).$promise,
        bars: Bar.query().$promise
      })
      .then(data => {
        vm.client = data.client;
        vm.typeString = vm.client.typeString.split(', ');
        bars = data.bars;
      })
      .then(() => {
        vm.center = {
          lat: vm.client.indirizzo.lat,
          lng: vm.client.indirizzo.lng
        };

        vm.title = `Indirizzo di ${vm.client.nome}`;

        vm.content = `
          <div class="info-window">
            <a
              class="maps-link"
              href="${vm.client.indirizzo.url}" target="_blank">
              APRI SU GOOGLE MAPS
              <i class="fa fa-external-link" aria-hidden="true"></i>
            </a>
          </div>
          `;

        for (var i = 0; i < vm.client.attivitaViste.length; i++) {
          vm.attivitaVisteIds.push(`${vm.client.attivitaViste[i].bar.id}`);
        }

        if (
          vm.client.importoInvestimento &&
          vm.client.importoInvestimento.anticipo
        ) {
          vm.anticipo = vm.client.importoInvestimento.anticipo;
        } else {
          vm.anticipo = '';
        }

        for (var j = 0; j < bars.length; j++) {
          const bar = bars[j];
          if (bar.richiestaTotale && bar.richiestaTotale.contanti) {
            if (
              parseFloat(bar.richiestaTotale.contanti) ===
              parseFloat(vm.anticipo)
            ) {
              // only query the bars who match between richiestaTotale and anticipo
              if (
                !vm.attivitaVisteIds.includes(`${bar.id}`) &&
                vm.typeString.includes(`${bar.tipologiaAttivita.name}`)
              )
                vm.filteredBars.push(bar);
            }
          }
        }
      })
      .catch(err => {
        $rootScope.$broadcast('error', err);
      });
  }

  $timeout(() => {
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.addEventListener('click', () => {
      var copyTextarea = document.getElementById('email');
      copyTextarea.select();

      try {
        var successful = document.execCommand('copy');
        // var msg = successful ? 'successful' : 'unsuccessful';
        // console.log('Copying text command was ' + msg);
        if (successful) {
          copyBtn.innerHTML =
            '<i class="fa fa-check normal-width" aria-hidden="true"></i> COPIATA';
          copyBtn.setAttribute('class', 'success');
        }
      } catch (err) {
        console.log('Oops, unable to copy');
      }
    });
  });

  function comment() {
    if (vm.commentForm.$valid) {
      Client.addComment({ id: $stateParams.id }, vm.comment)
        .$promise.then(() => {
          vm.comment = {};
          vm.commentForm.$setPristine();
          fetchClient();
        })
        .catch(err => {
          $rootScope.$broadcast('error', err);
        });
    }
  }

  function deleteComm(comment) {
    Client.deleteComment({ id: $stateParams.id, commentId: comment._id })
      .$promise.then(() => {
        fetchClient();
      })
      .catch(err => {
        $rootScope.$broadcast('error', err);
      });
  }

  function archive(addOrRemove) {
    Client.archiveClient({ id: $stateParams.id }, vm.client)
      .$promise.then(() => {
        addOrRemove === 'aggiungi'
          ? $state.go('archive', { clientOrBar: 'clients' })
          : $state.go('clientsIndex');
      })
      .catch(err => {
        $rootScope.$broadcast('error', err);
      });
  }

  $window.addEventListener('resize', () => {
    vm.showingFilters = CommonService.showFilters();
    vm.smallDevices = CommonService.smallDevices();
    if (!$scope.$$phase) $scope.$apply();
  });

  function expandFilters() {
    if ($window.innerWidth < 576) {
      vm.showingFilters
        ? (vm.showingFilters = false)
        : (vm.showingFilters = true);
    }
  }
}
