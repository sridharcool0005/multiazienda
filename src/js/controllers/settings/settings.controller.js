angular.module('multiazienda').controller('SettingsCtrl', SettingsCtrl);

SettingsCtrl.$inject = ['Type', 'CommonService', '$q'];

function SettingsCtrl(Type, CommonService, $q) {
  const vm = this;

  vm.types = [];
  vm.images = [];
  vm.accordions = {
    typeImages: false
  };
  vm.showingImagesModal = false;

  vm.typeEdited = {};
  vm.showModal = showModal;
  vm.checkUsedImgs = checkUsedImgs;
  vm.expandAccordion = expandAccordion;

  $q.all({
    images: Type.listImages().$promise,
    types: Type.query().$promise
  }).then(data => {
    vm.types = data.types;
    vm.checkUsedImgs(data.images);
  });

  function showModal(image = false, type = false) {
    if (type) {
      vm.typeEdited = type;
    }

    if (image && vm.typeEdited) {
      Type.update(
        { id: vm.typeEdited.id },
        { image: image.path }
      ).$promise.then(type => {
        vm.types.map(type => {
          if (type.id === vm.typeEdited.id) {
            type.image = image.path;
          }
          return type;
        });

        vm.checkUsedImgs(vm.images);

        vm.typeEdited = {};
      });
    }

    if (!type && !image) {
      vm.typeEdited = {};
    }

    vm.showingImagesModal = !vm.showingImagesModal;
  }

  function expandAccordion(which) {
    vm.accordions[which] = !vm.accordions[which];
  }

  function checkUsedImgs(images) {
    const usedImages = [];
    vm.types.map(type => usedImages.push(type.image));

    vm.images = images.map(image => {
      const imgObj = {
        path: typeof image === 'string' ? image : image.path,
        used: false
      };
      if (usedImages.includes(image)) {
        imgObj.used = true;
      }

      return imgObj;
    });
  }
}
