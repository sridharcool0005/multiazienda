angular
  .module('multiazienda')
  .filter('capitalise', capitalise);

function capitalise() {
  return function(input) {
    const arr = [];
    for (var i = 0; i < input.length; i++) {
      const currentLetter = input[i];
      arr.push(currentLetter);
      if (currentLetter === currentLetter.toUpperCase()) {
        arr.splice(i, 0, ' ');
      }
    }
    input = arr.join('');
    if (input != null) input = input.toLowerCase();
    return input.substring(0,1).toUpperCase()+input.substring(1);
  };
}
