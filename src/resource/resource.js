/**
 * WARNING: EXPERIMENTAL WORK IN PROGRESS.
 * 
 * Tries to implement something like ActiveResource.
 * 
 *   var User = Resource.create('User');
 *   
 *   User.find(1, function(user) { user.title });
 *   // User.create({name: "john"}, function(user) { ... });
 *   // User.update(1, {name: "john"}, function(user) { ... });
 *   // User.destroy(1, function(user) { ... });
 */

var Resource = function() {
  this.guessedAttributes = [];
}

Resource.create = function(name)
{
  var r = function() {}
  r.prototype = new Resource();
  r.prototype.klass = r;

  r.name = name;
  r.table_name = name.tableize();

  r.instanciate = function(attributes, newRecord)
  {
    eval("var record = new " + name + "()")
    record.load(attributes);
    return record;
  }

  r.url = function(id)
  {
    var url = '/' + r.table_name
    if (id) url += '/' + id;
    return url + '.json';
  }

  // Examples:
  // 
  //   User.findURL(1)                                                   # /users/1.json
  //   User.findURL(null, {from: "/authors.json"})                       # /authors.json
  //   User.findURL(null, {from: "editors"})                             # /users/editors.json
  //   User.findURL(2, {params: {story_id: 1}})                          # /stories/1/users/2.json
  //   
  //   Address.findURL(null, {from: "/stories/1/users/2/address.json"})  # /stories/1/users/2/address.json
  //   Address.findURL(1, params: {person_id: 1})                        # /people/1/addresses/1.xml
  // 
  //   Operation.findURL(null, {params: {account_id: 123}})              # /accounts/123/operations.xml
  //   Operation.findURL(456,  {params: {account_id: 123}})              # /accounts/123/operations/456.xml
  r.findURL = function(id, options)
  {
    if (options.from && options.from.match(/^&/) {
      return options.from
    }
    var url = '/' + r.table_name
    if (id)           url += '/' + id;
    if (options.from) url += '/' + options.from;
    return url + '.json';
  }

  // User.find(1, callback)                        # find_single('/users/1.json')
  // User.find('123', callback)                    # find_all('/users/123.json')
  // User.find('all',   callback, options)         # find_all('/users.json')
  // User.find('first', callback, options)         # find_all('/users.json').first
  // User.find('last',  callback, options)         # find_all('/users.json').last
  // 
  // var options = {from: 'about', :user_id => 1}
  // User.find('one', callback, options)           # find_one('/users/1/about.json')
  // 
  // var options = {from: 'about', params: {compagny_id: 1}}
  // StreetAddress.find('one', callback, options)  # find_one('/compagnies/1/street_address.json')
  // 
  // var options = {params: {account_id: 123}}
  // Operation.find('all', callback, options)      # find_all('/accounts/123/operations.json')
  // 
  // var options = {params: {account_id: 123, page: 4}}
  // Operation.find('one', callback, options)      # find_one('/accounts/123/operations.json?page=4')
  // 
  // var options = {params: {account_id: 123}}
  // Operation.find(1, callback, options)          # find_single('/accounts/123/operations/1.json')
  // 
  // var options = {from: 'new', params: {account_id: 123}}
  // Operation.find('one', callback, options)      # find_one('/accounts/123/operations/new.json')
  r.find = function(scope_or_id, callback, options)
  {
    switch (scope_or_id)
    {
      case 'all':   r.findAll(scope_or_id, callback, options); break;
      case 'first': r.findAll(scope_or_id, callback, options); break;
      case 'last':  r.findAll(scope_or_id, callback, options); break;
      case 'one':   r.findOne(callback, options); break;
      default:      r.findSingle(scope_or_id, callback, options);
    }
  }

  r.findAll = function(scope, callback, options)
  {
    var req = new Rails.Request();
    req.open('GET', r.url());
    
    req.addEventListener('load', function(event)
    {
      var records = [], data = JSON.parse(event.request.responseText);
      for (var i=0; i<data[name].length; i++) {
        records.push(r.instanciate(data[name][i]));
      }
      callback(records);
    });
    
    req.addEventListener('error', function(event)
    {
      if (event.request.status == 404) {
        throw new Error("Could not find " + name + " resource with ID: " + id);
      }
      else {
        throw new Error("Error " + event.request.status);
      }
    });
    
    req.send();
  }

  r.findSingle = function(id, options)
  {
    options.from = r.url(id);
    r.findOne();
  }

  r.findOne = function(callback, options)
  {
    var req = new Rails.Request();
    req.open('GET', options.from);
    
    req.addEventListener('load', function(event) {
      callback(JSON.parse(event.request.responseText)[name]);
    });
    
    req.addEventListener('error', function(event)
    {
      if (event.request.status == 404) {
        throw new Error("Could not find " + name + " resource with ID: " + id);
      }
      else {
        throw new Error("Error " + event.request.status);
      }
    });
    
    req.send();
  }
}

Resource.prototype.load = function(attributes)
{
  for (var key in attributes)
  {
    if (this.guessedAttributes.indexOf(key) == -1) {
      this.guessedAttributes.push(key);
    }
    this[key] = attributes[key];
  }
}

Resource.prototype.attributes = function(attributes)
{
  var attributes = {}, key;
  for (var i=0; i<this.guessedAttributes.length; i++)
  {
    key = this.guessedAttributes[i];
    attributes[key] = this[key];
  }
  return attributes;
}

Resource.prototype.to_json = function() {
  return JSON.encode(this.attributes());
}

