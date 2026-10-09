function getUpperCase(input) {
    return input.toUpperCase();
}

function getLowerCase(input){
    return input.toLowerCase();
}

function getSentenceCase(str){
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getProperCase(str){
    if (!str) return str;
    return str 
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

module.exports = {
  getUpperCase,
  getLowerCase,
  getSentenceCase,
  getProperCase
};