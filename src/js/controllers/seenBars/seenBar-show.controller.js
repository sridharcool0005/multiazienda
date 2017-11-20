angular.module('multiazienda').controller('SeenBarShowCtrl', SeenBarShowCtrl);

SeenBarShowCtrl.$inject = ['SeenBar', '$stateParams'];

function SeenBarShowCtrl(SeenBar, $stateParams) {
  const vm = this;
  vm.addComment = comment;
  vm.deleteComment = deleteComm;

  SeenBar.get({ id: $stateParams.id, barId: $stateParams.barId }).$promise.then(
    seenBar => {
      vm.seenBar = seenBar;
    }
  );

  function comment() {
    if (vm.commentForm.$valid) {
      SeenBar.addComment(
        { id: $stateParams.id, barId: $stateParams.barId },
        vm.comment
      ).$promise.then(() => {
        vm.comment = {};
        vm.commentForm.$setPristine();
        SeenBar.get({
          id: $stateParams.id,
          barId: $stateParams.barId
        }).$promise.then(bar => (vm.seenBar = bar));
      });
    }
  }

  function deleteComm(comment) {
    SeenBar.deleteComment({
      id: $stateParams.id,
      barId: $stateParams.barId,
      commentId: comment._id
    }).$promise.then(() => {
      SeenBar.get({
        id: $stateParams.id,
        barId: $stateParams.barId
      }).$promise.then(bar => (vm.seenBar = bar));
    });
  }
}
