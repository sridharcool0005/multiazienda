angular.module('multiazienda').factory('Place', Place);

Place.$inject = ['API', '$resource'];

function Place(API, $resource) {
  return $resource(
    `${API}/places/:id`,
    { id: '@_id' },
    {
      update: { method: 'PUT' }
    }
  );
}
