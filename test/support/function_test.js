//new Unit.TestCase('FunctionTest',
//{
//  test_bind: function()
//  {
//    var self = this, klass, instance, element, event;
//    
//    this.async();
//    
//    klass = function() { this.value = "titi"; }
//    klass.prototype.onfocus = function(event)
//    {
//      var _self = this;
//      self.sync(function() {
//        self.assertEqual('titi', _self.value);
//      });
//    }
//    
//    instance = new klass();
//    
//    element = document.createElement('input');
//    element.addEventListener('focus', instance.onfocus.bind(instance), false);
//    
//    event = document.createEvent('HTMLEvents');;
//    event.initEvent('focus', true, true);
//    element.dispatchEvent(event);
//  }
//});
