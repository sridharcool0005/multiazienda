angular
  .module('multiazienda')
  .factory('Location', Location);

Location.$inject = ['API', '$resource'];

function Location(API, $resource) {
  return $resource(`${API}/locations/:id`, {id: '@_id'}, {
    'update': { method: 'PUT'}
  });
}
