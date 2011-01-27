new Unit.TestCase('FunctionTest',
{
  setup: function()
  {
    this.element = document.createElement('input');
    document.body.appendChild(this.element);
  },

  teardown: function() {
    document.body.removeChild(this.element);
  },

  test_bind: function()
  {
    var self = this, klass, instance, element, event;
    
    this.async();
    
    klass = function() { this.value = "titi"; }
    klass.prototype.oncustom = function(event)
    {
      var _self = this;
      self.sync(function() {
        self.assertEqual('titi', _self.value);
      });
    }
    
    instance = new klass();
    this.element.addEventListener('custom', instance.oncustom.bind(instance), false);
    
    event = document.createEvent('HTMLEvents');
    event.initEvent('custom', true, true);
    this.element.dispatchEvent(event);
  }
});
