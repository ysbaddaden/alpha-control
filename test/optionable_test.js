new Unit.TestCase('Optionable',
{
  setup: function()
  {
    this.Klass = function() {}
    Optionable(this.Klass);
  },

  test_prototyped: function()
  {
    this.assertTypeOf('object',   this.Klass.prototype.options);
    this.assertTypeOf('function', this.Klass.prototype.setOptions);
  },

  test_setOptions: function()
  {
    this.Klass.prototype.options = {id: 'klass'}
    var instance = new this.Klass();
    
    instance.setOptions({id: 'instance', className: 'Klass'});
    this.assertEqual('instance', instance.options.id);
    this.assertEqual('Klass', instance.options.className);
  }
});
