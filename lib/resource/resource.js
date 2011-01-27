var Resource = function() {};

Resource.create = function(name)
{
  resource = function() {}
  resource.prototype = new Resource();
  resource.prototype.klass = resource;

  resource.name = name;
  resource.table_name = name.tableize();

  function instanciate(attributes, newRecord)
  {
    resource = new resource(attributes);
    resource.newRecord = newRecord || false;
  }

  function url = function(id)
  {
    var url = '/' + resource.table_name
    
    if (id) {
      url += '/' + id;
    }
    return url + '.xml';
  }

  resource.instanciate = instanciate;
  resource.url = url;

  resource.create = function(attributes, callback)
  {
    Rails.create(url(), attributes, function(response)
    {
      if (response.created()) {
        callback(instanciate(response.data));
      }
      else {
        callback(null);
      }
    });
  }

  Resource.find = function(id, callback)
  {
    Rails.read(url(id), function(response)
    {
      if (response.success()) {
        callback(instanciate(response.data));
      }
      else if (response.notFound()) {
        throw new Error("Could not find " + name + " resource with ID: " + id);
      }
    });
  }

  Resource.update = function(id, attributes, callback)
  {
    Rails.update(url(id), attributes, function(response)
    {
      if (response.success()) {
        callback(instanciate(response.data));
      }
      else if (response.notFound()) {
        throw new Error("Could not find " + name + " resource with ID: " + id);
      }
    });
  }

  Resource.destroy = function(id, callback)
  {
    Rails.destroy(url(id), attributes, function(response)
    {
      if (response.notFound()) {
        throw new Error("Could not find " + name + " resource with ID: " + id);
      }
      callback(response.success());
    });
  }

  Resource.belongsTo: function(resource)
  {
  }

  Resource.hasOne: function(resource)
  {
  }

  Resource.hasMany: function(resource)
  {
  }

  Resource.instanciate = instanciate;
}

Resource.prototype.persisted = function()
{
}

Resource.prototype.save = function()
{
}

Resource.prototype.updateAttribute = function(attribute, value)
{
}

Resource.prototype.updateAttributes = function(attributes)
{
}

Resource.prototype.destroy = function()
{
}

