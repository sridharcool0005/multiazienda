angular
  .module('multiazienda')
  .factory('Bar', Bar);

Bar.$inject = ['API', '$resource'];

function Bar(API, $resource) {
  return $resource(`${API}/bars/:id`, {id: '@_id'}, {
    'getArchived': { method: 'GET', url: `${API}/bars/archived`, isArray: true },
    'update': { method: 'PUT'},
    'addComment': { method: 'POST', url: `${API}/bars/:id/comments` },
    'deleteComment': { method: 'DELETE', url: `${API}/bars/:id/comments/:commentId` },
    'archiveBar': { method: 'PUT', url: `${API}/bars/:id/archived` }
  });
}
