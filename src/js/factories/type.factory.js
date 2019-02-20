angular.module('multiazienda').factory('Type', Type);

Type.$inject = ['API', '$resource'];

function Type(API, $resource) {
  return $resource(
    `${API}/types/:id`,
    { id: '@_id' },
    {
      listImages: { method: 'GET', url: `${API}/types/images`, isArray: true },
      update: { method: 'PUT' }
    }
  );
}
