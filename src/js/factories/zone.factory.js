angular
  .module('multiazienda')
  .factory('Zone', Zone);

Zone.$inject = ['API', '$resource'];

function Zone(API, $resource) {
  return $resource(`${API}/zones/:id`, {id: '@_id'}, {
    'update': { method: 'PUT'}
  });
}
