var Rails = {};

/**
 * Executes an HTTP request to a Ruby on Rails server. This object is made
 * necessary by the request forgery protection of ruby on rails, which requires
 * either an unique token to be passed either as a parameter or as a
 * X-CSRF-Token HTTP header.
 * 
 * The implementation is based on XMLHttpRequest 2 which uses events for
 * callbacks. If you overwrite the onreadystatechange method please be sure
 * to call Rails.Request.prototype.onreadystatechange or events won't be
 * dispatched!
 * 
 * Example:
 * 
 *   var r = new Rails.Request();
 *   r.open('get', '/posts');
 *   r.addEventListener('loadstart', onrequest);   // readyState = 3
 *   r.addEventListener('abort',     onabort);     // abort()
 *   r.addEventListener('error',     onfailure);   // readyState = 4 && status >= 400
 *   r.addEventListener('load',      onsuccess);   // readyState = 4 && status < 400
 *   r.addEventListener('loadend',   oncomplete);  // readyState = 4
 *   r.send();
 */
Rails.Request = function() {
  this.xhr = new XMLHttpRequest();
}
Eventable(Rails.Request, ['loadstart', 'abort', 'load', 'error', 'loadend']);

Rails.Request.prototype.createEvent = function(type)
{
  var event = new Eventable.Event();
  event.initEvent(type, false, true);
  event.request = this.xhr;
  return event;
}

Rails.Request.prototype.open = function(method, url)
{
  method = method.toLowerCase();
  this.xhr.open(method.toUpperCase(), url, true);
  this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
  if (method != 'get')
  {
    if (method == 'post' || method == 'put') {
      this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }  
    
    var csrf_token = Rails.readMeta('csrf-token');
    if (csrf_token) {
      this.xhr.setRequestHeader('X-CSRF-Token', csrf_token);
    }
  }
  this.xhr.onreadystatechange = this.onreadystatechange.bind(this);
}

Rails.Request.prototype.onreadystatechange = function()
{
  if (this.xhr.readyState == 3) {
    this.dispatchEvent('loadstart');
  }
  else if (this.xhr.readyState == 4)
  {
    this.dispatchEvent((this.xhr.status < 400) ? 'load' : 'error');
    this.dispatchEvent('loadend');
    this._clear();
  }
}

Rails.Request.prototype.send = function(body)
{
  if (typeof body == 'object') {
    body = Rails.toURLEncoded(body);
  }
  this.xhr.send(body || '');
}

Rails.Request.prototype.abort = function()
{
  if (this.xhr)
  {
    this.xhr.abort();
    this.dispatchEvent('abort');
    this._clear();
  }
}

Rails.Request.prototype._clear = function() {
  this.xhr = null;
}

// IMPROVE: move to a HTTP object in AlphaControl?
Rails.toURLEncoded = function(params)
{
  if (typeof params == 'string') {
    return params;
  }
  
  var query_string = [];
  for (var k in params) {
    query_string.push(encodeURIComponent(k) + "=" + encodeURIComponent(params[k]));
  }
  return query_string.join('&');
}

Rails.readMeta = function(name)
{
  var meta = document.querySelectorAll("meta[name=" + name + "]");
  return (meta.length > 0) ? meta[0].getAttribute('content') : null;
}

