new Unit.TestCase('EventableTest', 
{
  setup: function()
  {
    this.Klass = function() {};
    
    this.Klass.prototype.click = function() {
      this.dispatchEvent('click');
    }
    
    this.Klass.prototype.focus = function() {
      this.dispatchEvent(this.createEvent('focus', false));
    }
    
    this.Klass.prototype.custom = function()
    {
      var event = new Eventable.Event();
      event.initEvent('custom', true);
      this.dispatchEvent(event);
    }
    
    Eventable(this.Klass, ['click', 'focus', 'custom']);
    
    this.instance = new this.Klass();
  },

  test_prototyped: function()
  {
    this.assertTypeOf('function', this.Klass.prototype.addEventListener);
    this.assertTypeOf('function', this.Klass.prototype.removeEventListener);
    this.assertTypeOf('function', this.Klass.prototype.createEvent);
    this.assertTypeOf('function', this.Klass.prototype.dispatchEvent);
    this.assertTypeOf('function', this.Klass.prototype.onclick);
    this.assertTypeOf('function', this.Klass.prototype.onfocus);
    this.assertTypeOf('function', this.Klass.prototype.oncustom);
  },

  test_createEvent: function()
  {
    var event = this.instance.createEvent('focus');
    this.assertTypeOf('function', event.initEvent);
    this.assertEqual('focus', event.type);
    this.assertTrue(event.cancelable);
    
    var event = this.instance.createEvent('click', false);
    this.assertTypeOf('function', event.initEvent);
    this.assertEqual('click', event.type);
    this.assertFalse(event.cancelable);
  },

  test_onevent_custom: function()
  {
    this.async();
    
    this.instance.oncustom = function(event) {
      this.sync(function() { this.assertEqual('custom', event.type); });
    }.bind(this);
    
    this.instance.custom();
  },

  test_onevent_focus: function()
  {
    this.async();
    
    this.instance.onfocus = function(event) {
      this.sync(function() { this.assertEqual('focus', event.type); });
    }.bind(this);
    
    this.instance.focus();
  },

  test_add_remove_and_dispatch: function()
  {
    this.async();
    
    var i  = -1;
    var fn = function(event) { i += 5; };
    
    // add (launched first -> last)
    this.instance.addEventListener('click', function(event) { i += 1; });
    this.instance.addEventListener('click', function(event) { i += 3; });
    this.instance.addEventListener('click', fn);
    this.instance.addEventListener('click', function(event)
    {
      this.sync(function()
      {
        this.assertEqual('click', event.type);
        this.assertEqual(4, i);
      });
    }.bind(this));
    
    // on callback (launched first)
    this.instance.onclick = function(event) { i = 0; }
    
    // remove
    this.instance.removeEventListener('click', fn);
    
    // dispatch
    this.instance.click();
  },

  test_should_add_event_types: function()
  {
    Eventable(this.Klass, ['blur']);
    
    this.assertTypeOf('function', this.Klass.prototype.addEventListener);
    this.assertTypeOf('function', this.Klass.prototype.removeEventListener);
    this.assertTypeOf('function', this.Klass.prototype.createEvent);
    this.assertTypeOf('function', this.Klass.prototype.dispatchEvent);
    this.assertTypeOf('function', this.Klass.prototype.onclick);
    this.assertTypeOf('function', this.Klass.prototype.onfocus);
    this.assertTypeOf('function', this.Klass.prototype.oncustom);
    this.assertTypeOf('function', this.Klass.prototype.onblur);
  },

  test_should_not_overwrite_createElement: function()
  {
    var Klass = function() {}
    Klass.prototype.createEvent = function(type)
    {
      var event = new Eventable.Event();
      event.initEvent(type, false);
      event.target = this;
      return event;
    }
    Eventable(Klass, ['blur']);
    
    var instance = new Klass();
    this.assertSame(instance, instance.createEvent().target);
  },

  test_throws_error_if_event_type_already_exists: function()
  {
    var Klass = this.Klass;
    this.assertThrow('Error', function() { Eventable(Klass, ['click']) });
  }
});
