angular
  .module('multiazienda')
  .service('CommonService', CommonService);

CommonService.$inject = ['$window'];

function CommonService($window) {
  const self = this;

  self.showFilters = () => {
    if ($window.innerWidth < 576) {
      return false;
    } else {
      return true;
    }
  };

  self.smallDevices = () => {
    if ($window.innerWidth < 768) {
      return true;
    } else {
      return false;
    }
  };
}
