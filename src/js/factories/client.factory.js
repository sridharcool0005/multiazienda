angular
  .module('multiazienda')
  .factory('Client', Client);

Client.$inject = ['API', '$resource'];

function Client(API, $resource) {
  return $resource(`${API}/clients/:id`, {id: '@_id'}, {
    'getArchived': { method: 'GET', url: `${API}/clients/archived`, isArray: true },
    'update': { method: 'PUT' },
    'addComment': { method: 'POST', url: `${API}/clients/:id/comments` },
    'deleteComment': { method: 'DELETE', url: `${API}/clients/:id/comments/:commentId` },
    'archiveClient': { method: 'PUT', url: `${API}/clients/:id/archived` }
  });
}
