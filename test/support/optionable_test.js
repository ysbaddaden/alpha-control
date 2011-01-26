new Unit.TestCase('Optionable',
{
  setup: function()
  {
    this.Klass = function() {}
    Optionable(this.Klass);
  },

  test_prototyped: function()
  {
    this.assertTypeOf('function', this.Klass.prototype.initOptions);
    this.assertTypeOf('function', this.Klass.prototype.setOptions);
    this.assertTypeOf('function', this.Klass.prototype.setDefaultOptions);
  },

  test_initOptions: function()
  {
    
    var instance = new this.Klass();
    instance.initOptions();
    this.assertEqual({}, instance.options);
    
    var instance = new this.Klass();
    instance.initOptions();
    this.assertEqual({}, instance.options);
  },

  test_initOptions_shall_not_overwrite_options: function()
  {
    var instance = new this.Klass();
    instance.setDefaultOptions({id: 'toto'});
    instance.initOptions();
    this.assertEqual({id: 'toto'}, instance.options);
  },

  test_setOptions: function()
  {
    var instance = new this.Klass();
    instance.setDefaultOptions({id: 'klass', className: 'Object'});
    this.assertEqual('klass', instance.options.id);
    this.assertEqual('Object', instance.options.className);
  },

  test_setDefaultOptions: function()
  {
    var instance = new this.Klass();
    instance.setDefaultOptions({id: 'instance', className: 'Klass'});
    this.assertEqual('instance', instance.options.id);
    this.assertEqual('Klass', instance.options.className);
  },

  test_setDefaultOptions_shall_not_overwrite_options: function()
  {
    var instance = new this.Klass();
    instance.setOptions({id: 'instance', className: 'Klass'});
    instance.setDefaultOptions({id: 'instance2'});
    this.assertEqual('instance', instance.options.id);
    this.assertEqual('Klass', instance.options.className);
  },

  test_setOptions_shall_overwrite_options: function()
  {
    this.Klass.prototype.options = {id: 'klass'}
    var instance = new this.Klass();
    instance.setDefaultOptions({id: 'klass'});
    instance.setOptions({id: 'klass2'});
    this.assertEqual('klass2', instance.options.id);
  }
});
