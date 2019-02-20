angular.module('multiazienda').controller('TypeEditCtrl', TypeEditCtrl);

TypeEditCtrl.$inject = ['CommonService', 'Type', '$rootScope', '$document'];

function TypeEditCtrl(CommonService, Type, $rootScope, $document) {
  const vm = this;
  vm.type = false;

  vm.showTypeForm = CommonService.showTypeForm;
  vm.typeEdit = typeEdit;
  vm.images = [];

  console.log('type edit ctrl init');
  Type.listImages().$promise.then(images => {
    vm.images = images;
  });

  $rootScope.$on('showing modal', function(event, args) {
    console.log('showing modal received', args);

    if (args.which === 'type' && args.id) {
      vm.type = Type.get({ id: args.id });
      console.log(vm.type);
    }
  });

  function typeEdit() {
    console.log('editing', vm.type);

    // Type
    //   .save(vm.type)
    //   .$promise
    //   .then(() => {
    //     Type
    //       .query()
    //       .$promise
    //       .then(types => {
    //         vm.type = {};
    //         vm.types = types;
    //         $rootScope.$broadcast('types added');
    //         $rootScope.$broadcast('showing modal', {
    //           which: 'type'
    //         });
    //       });
    //   });
  }
}
