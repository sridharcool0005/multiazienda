angular.module('multiazienda').directive('googlePlace', googlePlace);

googlePlace.$inject = ['$window', '$rootScope'];

function googlePlace($window, $rootScope) {
  const directive = {
    restrict: 'E',
    replace: true,
    template: '<input type="text" id="google-places" style="width: 100%" />',
    scope: {},
    link($scope, element) {
      const input = document.getElementById('google-places');
      const locationId = randomString(23);

      input.addEventListener('input', function(e) {
        if (e.target.value.length > 3) {
          var results = document.getElementsByClassName('pac-container')[0];
          if (results.childNodes.length < 1) {
            $rootScope.$broadcast('no place', {
              denominazioneAttivita: e.target.value,
              photoArray: [
                'https://static.pexels.com/photos/3540/restaurant-alcohol-bar-drinks.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/9/93/Sali_e_Tabacchi.jpg',
                'https://static.pexels.com/photos/9315/menu-restaurant-france-eating-9315.jpg',
                'https://static.pexels.com/photos/3631/summer-dessert-sweet-ice-cream.jpg'
              ],
              locationId: locationId
            });
          }
        }
      });

      function randomString(length) {
        var text = '';
        var possible =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      }

      var autocomplete = new $window.google.maps.places.Autocomplete(
        element[0],
        {
          types: ['establishment'],
          componentRestrictions: { country: 'it' }
        }
      );
      autocomplete.addListener('place_changed', callback);

      function callback() {
        var place = autocomplete.getPlace();
        console.log(place);
        var photoArray = [];
        if (place.photos) {
          for (var i = 0; i < place.photos.length; i++) {
            var currentPhoto = place.photos[i].getUrl({
              maxWidth: 1920,
              maxHeight: 500
            });
            photoArray.push(currentPhoto);
          }
        } else {
          photoArray.push(
            'https://static.pexels.com/photos/3540/restaurant-alcohol-bar-drinks.jpg',
            'https://upload.wikimedia.org/wikipedia/commons/9/93/Sali_e_Tabacchi.jpg',
            'https://static.pexels.com/photos/9315/menu-restaurant-france-eating-9315.jpg',
            'https://static.pexels.com/photos/3631/summer-dessert-sweet-ice-cream.jpg'
          );
        }

        $rootScope.$broadcast('new place', {
          addressHTML: place.adr_address,
          addressFormatted: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name,
          photoArray: photoArray,
          locationId: place.place_id,
          website: place.website,
          url: place.url
        });
      }
    }
  };

  return directive;
}
