angular
  .module('multiazienda')
  .controller('SeenBarShowCtrl', SeenBarShowCtrl);

SeenBarShowCtrl.$inject = ['SeenBar', '$stateParams'];

function SeenBarShowCtrl(SeenBar, $stateParams) {
  const vm = this;
  vm.addComment = comment;
  vm.deleteComment = deleteComm;

  SeenBar
    .get({id: $stateParams.id, barId: $stateParams.barId })
    .$promise
    .then(seenBar => {
      vm.seenBar = seenBar;
      console.log(seenBar);
    });

  function comment() {
    SeenBar
      .addComment({ id: $stateParams.id, barId: $stateParams.barId }, vm.comment)
      .$promise
      .then(() => {
        vm.comment = '';
        vm.seenBar = SeenBar.get({ id: $stateParams.id, barId: $stateParams.barId });
      });
  }

  function deleteComm(comment) {
    SeenBar
      .deleteComment({ id: $stateParams.id, barId: $stateParams.barId, commentId: comment._id })
      .$promise
      .then(() => {
        SeenBar
          .get({ id: $stateParams.id, barId: $stateParams.barId })
          .$promise
          .then(seenBar => vm.seenBar = seenBar);
      });
  }
}
