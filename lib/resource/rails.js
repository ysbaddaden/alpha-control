var Rails = {};

Rails.CSRFParam = null;
Rails.CSRFToken = null;

Rails.addCSRF = function(body)
{
  if (Rails.CSRFParam === null)
  {
    Rails.CSRFParam = this.readMeta('csrf_param');
    Rails.CSRFToken = this.readMeta('csrf_token');
  }
}

Rails.read = function(url)
{
}

Rails.create = function(url, data)
{
  var body = Rails.addCSRF(data);
  // ...
}

Rails.update = function(url, data)
{
  var body = Rails.addCSRF(data);
  // ...
}

Rails.destroy = function(url)
{
  var body = Rails.addCSRF(data);
  // ...
}

Rails.Response = function() {}

Rails.Response.prototype.initResponse = function(status, xml)
{
  this.status = status;
  this.xml    = xml;
}

Rails.Response.StatusCodes = {
  success: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  unprocessableEntity: 422,
}

for (var status in Rails.Response.StatusCodes) {
  Rails.Response[status] = function() { this.status == Rails.Response.StatusCodes[status] }
}
Rails.Response.error       = function() { return (this.status >= 400) }
Rails.Response.serverError = function() { return (this.status >= 500) }

