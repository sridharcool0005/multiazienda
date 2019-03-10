angular.module('multiazienda').filter('capitalise', capitalise);

function capitalise() {
  return function(input) {
    if (input) {
      const words = input.toLowerCase().split(' ');
      let capitalised = '';
      words.map(word => {
        capitalised += `${word.substring(0, 1).toUpperCase() +
          word.substring(1)} `;
      });
      return capitalised;
    }
  };
}
