angular
  .module('multiazienda')
  .factory('SeenBar', SeenBar);

SeenBar.$inject = ['API', '$resource'];

function SeenBar(API, $resource) {
  return $resource(`${API}/clients/:id/bars/:barId`, {id: '@_id'}, {
    'update': { method: 'PUT'},
    'addComment': { method: 'POST', url: `${API}/clients/:id/bars/:barId/comments` },
    'deleteComment': { method: 'DELETE', url: `${API}/clients/:id/bars/:barId/comments/:commentId` }
  });
}
