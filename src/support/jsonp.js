var JSONP = {};

JSONP.Request = function () {};
JSONP.Request.counter = 0;

Optionable(JSONP.Request);

JSONP.createRequest = function () {
  var req = new JSONP.Request();
  req.open.call(req, arguments);
  return req;
}

JSONP.Request.prototype.open = function (uri, callback, options) {
  var self = this;
  
  this.setDefaultOptions({ param: 'callback' });
  this.setOptions(options);
  
  this.uri      = uri;
  this.callback = callback;
  this.counter  = JSONP.Request.counter += 1;
  
  window[this.callbackName()] = function (responseJSON) {
    callback(responseJSON);
    self.abort();
  }
}

JSONP.Request.prototype.callbackName = function () {
  return 'jsonp_request_' + this.counter;
}

JSONP.Request.prototype.url = function () {
  return this.uri + (this.uri.match(/\?/) ? '&' : '?') +
    encodeURIComponent(this.options.param) + '=' + this.callbackName();
}

JSONP.Request.prototype.send = function () {
  var node = document.createElement('script');
  node.setAttribute('type', 'text/javascript');
  node.setAttribute('src', this.url());
  node.setAttribute('charset', 'UTF-8');
  node.setAttribute('id', 'jsonp-' + this.counter);
  document.getElementsByTagName('head')[0].appendChild(node);
}

JSONP.Request.prototype.abort = function () {
  var node = document.getElementById('jsonp-' + this.counter);
  if (node) {
    node.parentNode.removeChild(node);
  }
  window[this.callbackName()] = null;
}

