/**
 * Adds support for events to any Object prototype.
 * 
 * Example:
 * 
 *   var MyClass = function() {}
 *   Eventable(MyClass, ['something']);
 *   
 *   MyClass.prototype.doSomething = function()
 *   {
 *     var event = this.createEvent('something');
 *     this.dispatchEvent(event);
 *   }
 *   
 *   MyClass.addEventListener('something', function(event) {});
 *   MyClass.onsomething = function(event) {};
 *   
 *   MyClass.doSomething();
 */
var Eventable = function(object, types)
{
  object.prototype._event_listeners = {};

  types.forEach(function(type)
  {
    if (typeof object.prototype['on' + type] != 'undefined') {
      throw new Error("Event type '" + type + "' already defined.");
    }
    object.prototype._event_listeners[type] = [];
    object.prototype['on' + type] = function(event) {}
  });

  if (typeof object.prototype.addEventListener == 'undefined')
  {
    // Adds an event listener to this object.
    object.prototype.addEventListener = function(type, callback)
    {
      if (typeof this._event_listeners[type] == 'undefined') {
        throw new Error("No such event type '" + type + "'");
      }
      this._event_listeners[type].push(callback)
    }
  }

  if (typeof object.prototype.removeEventListener == 'undefined')
  {
    // Removes an event listener from this object.
    object.prototype.removeEventListener = function(type, callback)
    {
      if (typeof this._event_listeners[type] == 'undefined') {
        throw new Error("No such event type '" + type + "'");
      }
      var pos = this._event_listeners[type].indexOf(callback);
      if (pos != -1) {
        this._event_listeners[type].splice(pos, 1)
      }
    }
  }

  if (typeof object.prototype.createEvent == 'undefined')
  {
    /**
     * Simple wrapper to create and initialize a basic Event, to leverage the
     * hassle of manually creating and initializing an event object each and
     * every time you need to dispatch an event.
     * 
     * You may overwrite it to return your own custom event objects.
     */
    object.prototype.createEvent = function(type, cancelable)
    {
      if (typeof cancelable == 'undefined') {
        cancelable = true
      }
      
      var event = new Eventable.Event();
      event.initEvent(type, cancelable);
      return event;
    }
  }
  
  if (typeof object.prototype.dispatchEvent == 'undefined')
  {
    /**
     * Dispatches an event on this object.
     * 
     * Examples:
     * 
     *   // actually calls this.createEvent('something')
     *   this.dispatchEvent('something');
     *   
     *   // manual call to this.createEvent
     *   this.dispatchEvent(this.createEvent('something', false));
     *   
     *   // manual creation and initialization of event:
     *   var event = new Eventable.Event();
     *   event.initEvent('something', true);
     *   this.dispatchEvent(event);
     * 
     * FIXME: A callback throwing an exception shouldn't break the chain.
     */
    object.prototype.dispatchEvent = function(event_or_type)
    {
      var event = (typeof event_or_type == 'string') ?
        this.createEvent(event_or_type) : event_or_type;
      
      if (typeof this['on' + event.type] == 'undefined') {
        throw new Error("No such event type '" + event.type + "'");
      }
      
      if (this['on' + event.type](event) === true) {
        event.preventDefault();
      }
      
      for (var i=0, len = this._event_listeners[event.type].length; i<len; i++)
      {
        if (event.propagationStopped === true) {
          break;
        }
        this._event_listeners[event.type][i](event);
      }
      
      return event.defaultPrevented;
    }
  }
}

/**
 * Basic Event object. Any custom Event object for Eventable must inheritate
 * from it.
 * 
 * Example:
 * 
 *   var MyEvent = function() {}
 *   MyEvent.prototype = new Eventable.Event();
 *   
 *   MyEvent.prototype.initMyEvent = function(type, cancelable, target)
 *   {
 *     Eventable.Event.initEvent.call(this, type, cancelable);
 *     this.target = target;
 *   }
 *   
 *   var event = new MyEvent();
 *   event.initMyEvent('type', true, element);
 */
Eventable.Event = function() {}
Eventable.Event.prototype = {
  initEvent: function(type, cancelable)
  {
    this.type = type;
    this.cancelable = cancelable;
    this.defaultPrevented   = null;
    this.propagationStopped = null;
  },

  preventDefault: function()
  {
    if (this.cancelable) {
      this.defaultPrevented = true;
    }
  },

  stopPropagation: function() {
    this.propagationpropagationStopped = true;
  }
}
