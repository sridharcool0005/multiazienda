angular.module('multiazienda').service('CommonService', CommonService);

CommonService.$inject = ['$window', '$rootScope'];

function CommonService($window, $rootScope) {
  const self = this;

  self.showFilters = () => {
    if ($window.innerWidth < 576) {
      return false;
    } else {
      return true;
    }
  };

  self.smallDevices = () => {
    if ($window.innerWidth < 767) {
      return true;
    } else {
      return false;
    }
  };

  self.showModal = (which, id = false) => {
    $rootScope.$broadcast('showing modal', { which, id });
  };
}
