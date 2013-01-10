var HTTP = {};

HTTP.toQueryString = function (params) {
    if (typeof params === 'string') {
        return params;
    }
    var queryString = [];
    for (var k in params) {
        queryString.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
    }
    return queryString.join('&');
};
