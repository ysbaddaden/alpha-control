var Resource = function() {};

Resource.create = function(name)
{
  resource = function() {
    this.columnNames = [];
  }
  resource.prototype = new Resource();
  resource.prototype.klass = resource;

  resource.name = name;
  resource.table_name = name.tableize();

  resource.instanciate = function(attributes, newRecord)
  {
    eval("var record = new " + name + "()")
    record.setAttributes(attributes);
    record.newRecord = newRecord || false;
    return record;
  }

  resource.url = function(id)
  {
    var url = '/' + resource.table_name
    if (id) url += '/' + id;
    return url + '.xml';
  }

  resource.find = function(id, callback)
  {
    Rails.read(resource.url(id), function(response)
    {
      if (response.success()) {
        callback(resource.instanciate(response.data));
      }
      else if (response.notFound()) {
        throw new Error("Could not find " + name + " resource with ID: " + id);
      }
    });
  }

  // FIXME: pass errors on create failure.
  resource.create = function(attributes, callback)
  {
    var record;
    
    Rails.create(resource.url(), attributes, function(response)
    {
      if (response.created())
      {
        record = resource.instanciate(response.data, false);
        callback(record);
      }
      else if (response.unprocessableEntity())
      {
        record = resource.instanciate(attributes, true);
        record.setErrors(response.data());
        callback(record);
      }
    });
  }

  // FIXME: read record before updating?
  // FIXME: pass errors on update failure.
  resource.update = function(id, attributes, callback)
  {
    var url = resource.url(id);
    
    Rails.read(url, function(response)
    {
      var record = resource.instanciate(attributes, false);
      
      if (response.success())
      {
        Rails.update(url, attributes, function(response)
        {
          if (response.success())
          {
            record.setAttributes(attributes);
            callback(record);
          }
          else if (response.unprocessableEntity())
          {
            record.setErrors(response.data());
            callback(record);
          }
        });
      }
      else if (response.notFound()) {
        throw new Error("Could not find " + name + " resource with ID: " + id);
      }
    });
  }

  resource.destroy = function(id, callback)
  {
    Rails.destroy(url(id), attributes, function(response)
    {
      if (response.notFound()) {
        throw new Error("Could not find " + name + " resource with ID: " + id);
      }
      callback(response.success());
    });
  }
}

Resource.prototype.setAttributes = function(attributes)
{
  for (var columnName in attributes)
  {
    if (this.columns.indexOf(columnName) == -1) {
      this.columns.push(columnName);
    }
    this[columnName] = attributes[columnName];
  }
}

Resource.prototype.getAttributes = function()
{
  var attributes = {};
  
  for (var i=0, len=this.columnNames.length; i++)
  {
    columnName = this.columnNames[i];
    attributes[columnName] = this[columnName];
  }
  return attributes;
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

