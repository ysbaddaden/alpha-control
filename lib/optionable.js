var Optionable = function(klass)
{
  klass.prototype.options = {};
  klass.prototype.setOptions = function(options)
  {
    for (var i in (options || {})) {
      this.options[i] = options[i];
    }
  }
}

