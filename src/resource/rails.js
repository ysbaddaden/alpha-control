/**
 * Simplifies requests to a Ruby on Rails application.
 * 
 * TODO: multipart encoding of xhr request bodies.
 * TODO: throw an Error on HTTP 500 Server Error.
 */
var Rails = {};

Rails.read = function(url, callback) {
  Rails.request('get', url, null, callback);
}

Rails.create = function(url, data, callback) {
  Rails.request('post', url, data, callback);
}

Rails.update = function(url, data, callback) {
  Rails.request('put', url, data, callback);
}

Rails.destroy = function(url, callback) {
  Rails.request('delete', url, null, callback);
}

Rails.request = function(method, url, data, callback)
{
  if (!data) data = {};
  
  if (method == 'delete' || method == 'put')
  {
    data[method] = method;
    method = 'post';
  }
  data = Rails.addCSRF(data);
  
  var xhr = new XMLHttpRequest();
  xhr.open(method.toUpperCase(), url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
  if (method == 'post')
  {
//    if (options.mutipart) {
//      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
//    }
//    else {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//    }
  }
  
  xhr.onreadystatechange = function()
  {
    if (xhr.readyState == 4)
    {
      var response = new Rails.Response()
      response.initResponse(xhr.status, xhr.messageXML);
      callback(response);
    }
  }
  xhr.send(method == 'post' ? Rails.toBody(data, false) : '');
  
  return xhr;
}

Rails.toBody = function(data, multipart)
{
  if multipart
  {
    throw new Error("Multipart upload isn't yet supported.");
  }
  else
  {
    var body = [];
    
    for (var k in data) {
      body.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    }
    return body.join('&');
  }
}

Rails.CSRFParam = null;
Rails.CSRFToken = null;

Rails.addCSRF = function(body)
{
  if (Rails.CSRFParam === null)
  {
    Rails.CSRFParam = Rails.readMeta('csrf_param');
    Rails.CSRFToken = Rails.readMeta('csrf_token');
  }
}

Rails.readMeta = function(name)
{
  var meta = document.querySelectorAll("meta[name=" + name + "]");
  return (meta.length > 0) ? meta[0].getAttribute('content') : null;
}

/**
 * Response sent to callbacks by the read, create, update and destroy
 * methods of Rails.
 */
Rails.Response = function() {}

Rails.Response.StatusCodes = {
  success: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  unprocessableEntity: 422,
}

Rails.Response.prototype.initResponse = function(status, xml)
{
  this.status = status;
  this.xml    = xml;
}

for (var status in Rails.Response.StatusCodes) {
  Rails.Response.prototype[status] = function() { this.status == Rails.Response.StatusCodes[status] }
}
Rails.Response.prototype.error       = function() { return (this.status >= 400); }
Rails.Response.prototype.serverError = function() { return (this.status >= 500); }

// Parses the XML response, and returns a hash of attributes.
Rails.response.prototype.data = function()
{
  // TODO: Rails.response.prototype.data()
  console.log(xml);
}

