angular
  .module('multiazienda')
  .factory('Type', Type);

Type.$inject = ['API', '$resource'];

function Type(API, $resource) {
  return $resource(`${API}/types/:id`, {id: '@_id'}, {
    'update': { method: 'PUT'}
  });
}
