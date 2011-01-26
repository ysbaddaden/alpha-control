RegExp.escape = function(str) {
  return str.replace(new RegExp('[.*+?|()\\[\\]{}\\\\]', ''), '\\$&');
}

