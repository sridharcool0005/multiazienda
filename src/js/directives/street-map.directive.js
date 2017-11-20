angular.module('multiazienda').directive('streetMap', streetMap);

streetMap.$inject = ['$window', '$timeout'];

function streetMap($window, $timeout) {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="google-map">GOOGLE MAP</div>',
    scope: {
      center: '=',
      zoom: '=',
      title: '@',
      content: '@'
    },
    link(scope, element) {
      $timeout(() => {
        var infoWindow = new $window.google.maps.InfoWindow();

        const icon = {
          url: 'https://image.flaticon.com/icons/svg/33/33622.svg',
          scaledSize: new $window.google.maps.Size(50, 50)
        };

        const map = new $window.google.maps.Map(element[0], {
          zoom: 14,
          center: scope.center,
          scrollwheel: false,
          styles: [
            { elementType: 'geometry', stylers: [{ saturation: -100 }] },
            {
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#FFFFFF' }]
            },
            { elementType: 'labels.text.fill', stylers: [{ color: '#242f3e' }] }
          ]
        });

        const marker = new $window.google.maps.Marker({
          position: scope.center,
          map: map,
          title: scope.title,
          icon: icon,
          animation: $window.google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          createInfoWindow(marker, scope.content);
        });

        function createInfoWindow(marker, content) {
          if (infoWindow) infoWindow.close();

          infoWindow = new $window.google.maps.InfoWindow({
            content: content
          });

          infoWindow.open(map, marker);
        }
      }, 200);
    }
  };
}
