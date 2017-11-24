angular.module('multiazienda').filter('itnumber', itnumber);

function itnumber() {
  return function(input) {
    let newInput;
    if (input) {
      newInput = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    return newInput;
  };
}
