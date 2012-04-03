RegExp.escape = function(str) {
  return str.replace(/[.*+?|()\[\]{}\\]/g, '\\$&');
};
