var Optionable = function (klass) {
  // Inits options as empty hash unless it was already defined.
  klass.prototype.initOptions = function () {
    if (typeof this.options === 'undefined') {
      this.options = {};
    }
  };
  
  // Sets options, overwriting those already in place.
  klass.prototype.setOptions = function (options) {
    this.initOptions();
    for (var i in (options || {})) {
      this.options[i] = options[i];
    }
  };
  
  // Sets options unless they're already defined.
  klass.prototype.setDefaultOptions = function (options) {
    this.initOptions();
    for (var i in (options || {})) {
      if (typeof this.options[i] === 'undefined') {
        this.options[i] = options[i];
      }
    }
  };
};

