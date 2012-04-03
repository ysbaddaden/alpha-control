var HTTP = {};

HTTP.toQueryString = function (params) {
  if (typeof params === 'string') {
    return params;
  }
  var query_string = [];
  for (var k in params) {
    query_string.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
  }
  return query_string.join('&');
};

