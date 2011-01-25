/**
 * http://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array
 */

// JavaScript 1.6

if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(elt /*, from*/)
	{
		var len  = this.length;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) {
			from += len;
		}
		for (; from < len; from++)
		{
			if (from in this && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}

if (!Array.prototype.lastIndexOf)
{
	Array.prototype.lastIndexOf = function(elt /*, from*/)
	{
		var len  = this.length;
		var from = Number(arguments[1]);
		if (isNaN(from)) {
			from = len - 1;
		}
		else
		{
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0) {
				from += len;
			}
			else if (from >= len) {
				from = len - 1;
			}
		}
		for (; from > -1; from--)
		{
			if (from in this && this[from] === elt) {
				return from;
			}
		}
		return -1;
	};
}

if (!Array.prototype.every)
{
	Array.prototype.every = function(fn /*, self*/)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this && !fn.call(self, this[i], i, this)) {
				return false;
			}
		}
		return true;
	};
}

if (!Array.prototype.filter)
{
	Array.prototype.filter = function(fn /*, self*/)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var res  = new Array();
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this)
			{
				var val = this[i]; // in case fn mutates this
				if (fn.call(self, val, i, this)) {
					res.push(val);
				}
			}
		}
		return res;
	};
}

if (!Array.prototype.forEach)
{
	Array.prototype.forEach = function(fn)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this) {
				fn.call(self, this[i], i, this);
			}
		}
	}
}

if (!Array.prototype.map)
{
	Array.prototype.map = function(fn /*, self*/)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var res  = new Array(len);
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this) {
				res[i] = fn.call(self, this[i], i, this);
			}
		}
		return res;
	};
}

if (!Array.prototype.some)
{
	Array.prototype.some = function(fn /*, self*/)
	{
		if (typeof fn != "function") {
			throw new TypeError();
		}
		var self = arguments[1];
		for (var i = 0, len = this.length; i < len; i++)
		{
			if (i in this && fn.call(self, this[i], i, this))
			return true;
		}
		return false;
	};
}


// JavaScript 1.8

if (!Array.prototype.reduce)
{
	Array.prototype.reduce = function(fn /*, initial*/)
	{
		var len = this.length;
		if (typeof fn != "function") {
			throw new TypeError();
		}

		// no value to return if no initial value and an empty array
		if (len == 0 && arguments.length == 1) {
			throw new TypeError();
		}

		var i = 0;
		if (arguments.length >= 2) {
			var rv = arguments[1];
		}
		else
		{
			do
			{
				if (i in this)
				{
					rv = this[i++];
					break;
				}

				// if array contains no values, no initial value to return
				if (++i >= len) {
					throw new TypeError();
				}
			}
			while (true);
		}

		for (; i < len; i++)
		{
			if (i in this) {
				rv = fn.call(null, rv, this[i], i, this);
			}
		}

		return rv;
	};
}

if (!Array.prototype.reduceRight)
{
	Array.prototype.reduceRight = function(fn /*, initial*/)
	{
		var len = this.length;
		if (typeof fn != "function") {
			throw new TypeError();
		}

		// no value to return if no initial value, empty array
		if (len == 0 && arguments.length == 1) {
			throw new TypeError();
		}

		var i = len - 1;
		if (arguments.length >= 2) {
			var rv = arguments[1];
		}
		else
		{
			do
			{
				if (i in this)
				{
					rv = this[i--];
					break;
				}

				// if array contains no values, no initial value to return
				if (--i < 0) {
					throw new TypeError();
				}
			}
			while (true);
		}

		for (; i >= 0; i--)
		{
			if (i in this) {
				rv = fn.call(null, rv, this[i], i, this);
			}
		}

		return rv;
	};
}
/* JavaScript 1.8 */

if (!String.prototype.trim)
{
  String.prototype.trim = function() {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  }
}

/**
 * Core JavaScript backward compatibility.
 */

var Alpha = {};

// Internet Explorer browser sniffing (comes handy sometimes).
Alpha.browser = {
  ie:  !!(window.VBArray),
  ie6: !!(window.VBArray && document.implementation)
};

// NodeList emulator
Alpha.NodeList = function(nodes)
{
  for(var i=0, len=nodes.length; i<len; i++) {
    this[i] = nodes[i];
  }
  this.length = nodes.length;
}
Alpha.NodeList.prototype.item = function(i) {
  return this[i];
}

// Shortcut for document.getElementById, and element extender for MSIE < 8.
Alpha.$ = function(element)
{
  if (typeof element == "string") {
    element = document.getElementById(element)
  }
  else if (Alpha.extendElement) {
    element = Alpha.extendElement(element);
  }
  return element;
}

// Shortcut: $ => Alpha.$
if (typeof window.$ == "undefined") {
  window.$ = Alpha.$;
}

/**
 * Tries to emulate the DOM Element prototype in MSIE < 8.
 */

// The following tries to fix the DOM Element in MSIE < 8.
if (typeof Element == 'undefined')
{
  // Garbage Collector, to prevent memory leaks
  Alpha.garbage = [];
  window.attachEvent('onunload', function()
  {
    for (var i=0, len=Alpha.garbage.length; i<len; i++)
    {
      var element = Alpha.garbage[i];
      if (element)
      {
        // FIXME: Calling elm.clearAttributes() on unload crashes IE7?!
//        if (element.clearAttributes) {
//          element.clearAttributes();
//        }
        if (element.clearEvents) {
          element.clearEvents();
        }
      }
      delete Alpha.garbage[i];
    }
  });
  
  // Generic Object prototype emulator
  Alpha.prototypeEmulator = function()
  {
    var Obj       = {};
    Obj.prototype = {};

    Obj._alpha_extend = function(o)
    {
      if (/*typeof o == 'object' &&*/ !o._alpha_extended)
      {
        Alpha.garbage.push(o);

        for (var method in Obj.prototype)
        {
          // saves the original method
          if (o[method] && !o['_alpha_' + method]) {
            o['_alpha_' + method] = o[method];
          }
          
          // creates (or overwrites) the method
          o[method] = Obj.prototype[method];
        }
        o._alpha_extended = true;
      }
      return o;
    }
    return Obj;
  }

  // Emulates the DOM Element prototype
  Element = new Alpha.prototypeEmulator();

  // Manually extends an element
  Alpha.extendElement = function(elm) {
    return Element._alpha_extend(elm);
  }

  // Manually extends many elements
  Alpha.extendElements = function(elms)
  {
    var rs = [];
    for (var i=0, len=elms.length; i<len; i++) {
      rs.push(Alpha.extendElement(elms[i]));
    }
    return rs;
  }

  // document.createElement should return an already extended element
  // also extends <canvas> elements if excanvas.js is loaded
  Alpha._msie_createElement = document.createElement;
  document.createElement = function(tagName)
  {
    var elm = Alpha._msie_createElement(tagName);
    if (tagName == 'canvas' && window.G_vmlCanvasManager) {
      elm = G_vmlCanvasManager.initElement(elm);
    }
    return Alpha.extendElement(elm);
  }

  // document.getElementById should return an extended element
  Alpha._msie_getElementById = document.getElementById;
  document.getElementById = function(id)
  {
    var elm = Alpha._msie_getElementById(id);
    return elm ? Alpha.extendElement(elm) : elm;
  }

  // document.getElementsByName should return extended elements
  Alpha._msie_getElementsByName = document.getElementsByName;
  document.getElementsByName = function(id)
  {
    var elms = Alpha._msie_getElementsByName(id);
    return elms.length ? new Alpha.NodeList(Alpha.extendElements(elms)) : elms;
  }

  // document.getElementsByTagName should return extended elements
  Alpha._msie_getElementsByTagName = document.getElementsByTagName;
  document.getElementsByTagName = function(id)
  {
    var elms = Alpha._msie_getElementsByTagName(id);
    return elms.length ? new Alpha.NodeList(Alpha.extendElements(elms)) : elms;
  }

  // elm.getElementsByTagName should return extended elements
  Element.prototype.getElementsByTagName = function(id)
  {
    var elms = this._alpha_getElementsByTagName(id);
    return elms.length ? new Alpha.NodeList(Alpha.extendElements(elms)) : elms;
  }

  // fixes a pseudo-leak in MSIE
  Element.prototype.removeChild = function(child)
  {
    var garbage = document.getElementById('_alpha_msie_leak_garbage');
    if (!garbage)
    {
      garbage = document.createElement('div');
      garbage.id = '_alpha_msie_leak_garbage';
      garbage.style.display    = 'none';
      garbage.style.visibility = 'hidden';
      document.body.appendChild(garbage);
    }
    
    // removes the child
    this._alpha_removeChild(child);
    
    // destroys the reference
    garbage.appendChild(child);
    garbage.innerHTML = '';
  }
}

(function()
{
  var elm = document.createElement('div');
  
//  if (typeof elm.textContent == 'undefined')
//  {
//    Element.prototype._alpha_get_textContent = function ()
//    {
//      if (typeof this.innerText != 'undefined') {
//        return this.innerText;
//      }
//      var r = this.ownerDocument.createRange();
//      r.selectNodeContents(this);
//      return r.toString();
//    }
//    
//    if (Object.defineProperty)
//    {
//      Object.defineProperty(Element.prototype, 'textContent', {
//        get: Element.prototype._alpha_get_textContent});
//    }
//    else if (Element.prototype.__defineGetter__)
//    {
//      Element.prototype.__defineGetter__('textContent',
//        Element.prototype._alpha_get_textContent);
//    }
//  }

  if (typeof elm.innerText == 'undefined')
  {
    Element.prototype._alpha_get_innerText = function() {
      return this.textContent;
    }
    
    Element.prototype._alpha_set_innerText = function(text) {
      return this.textContent = text;
    }
    
    if (Object.defineProperty)
    {
      Object.defineProperty(Element.prototype, 'innerText', {
        get: Element.prototype._alpha_get_innerText,
        set: Element.prototype._alpha_set_innerText
      });
    }
    else if (Element.prototype.__defineGetter__)
    {
      Element.prototype.__defineGetter__('innerText', Element.prototype._alpha_get_innerText);
      Element.prototype.__defineSetter__('innerText', Element.prototype._alpha_set_innerText);
    }
  }

  if (typeof elm.children == 'undefined')
  {
    Element.prototype._alpha_get_children = function()
    {
      var children = [];
      var child = this.firstChild;
      while (child)
      {
        if (child.nodeType == 1) {
          children.push(child);
        }
        child = child.nextSibling;
      }
      return Alpha.extendElements ? Alpha.extendElements(children) : children;
    }
    
    if (Object.defineProperty)
    {
      Object.defineProperty(Element.prototype, 'children', {
        get: Element.prototype._alpha_get_children});
    }
    else if (Element.prototype.__defineGetter__)
    {
      Element.prototype.__defineGetter__('children',
        Element.prototype._alpha_get_children);
    }
  }

  if (typeof elm.childElementCount == 'undefined')
  {
    Element.prototype._alpha_get_childElementCount = function() {
      return this.children.length;
    }

    Element.prototype._alpha_get_firstElementChild = function()
    {
      var child = this.firstChild;
      while (child && child.nodeType != 1) {
        child = child.nextSibling;
      }
      return (child && child.nodeType == 1) ? Alpha.$(child) : null;
    }

    Element.prototype._alpha_get_lastElementChild = function()
    {
      var child = this.lastChild;
      while (child && child.nodeType != 1) {
        child = child.previousSibling;
      }
      return (child && child.nodeType == 1) ? Alpha.$(child) : null;
    }

    Element.prototype._alpha_get_nextElementSibling = function()
    {
      var sibling = this.nextSibling;
      while (sibling && sibling.nodeType != 1) {
        sibling = sibling.nextSibling;
      }
      return (sibling && sibling.nodeType == 1) ? Alpha.$(sibling) : null;
    }

    Element.prototype._alpha_get_previousElementSibling = function()
    {
      var sibling = this.previousSibling;
      while (sibling && sibling.nodeType != 1) {
        sibling = sibling.previousSibling;
      }
      return (sibling && sibling.nodeType == 1) ? Alpha.$(sibling) : null;
    }
    
    if (Object.defineProperty)
    {
      Object.defineProperty(Element.prototype, 'childElementCount',      {get: Element.prototype._alpha_get_childElementCount});
      Object.defineProperty(Element.prototype, 'firstElementChild',      {get: Element.prototype._alpha_get_firstElementChild});
      Object.defineProperty(Element.prototype, 'lastElementChild',       {get: Element.prototype._alpha_get_lastElementChild});
      Object.defineProperty(Element.prototype, 'nextElementSibling',     {get: Element.prototype._alpha_get_nextElementSibling});
      Object.defineProperty(Element.prototype, 'previousElementSibling', {get: Element.prototype._alpha_get_previousElementSibling});
    }
    else if (Element.prototype.__defineGetter__)
    {
      Element.prototype.__defineGetter__('childElementCount',      Element.prototype._alpha_get_childElementCount);
      Element.prototype.__defineGetter__('firstElementChild',      Element.prototype._alpha_get_firstElementChild);
      Element.prototype.__defineGetter__('lastElementChild',       Element.prototype._alpha_get_lastElementChild);
      Element.prototype.__defineGetter__('nextElementSibling',     Element.prototype._alpha_get_nextElementSibling);
      Element.prototype.__defineGetter__('previousElementSibling', Element.prototype._alpha_get_previousElementSibling);
    }
  }
  
  // makes getAttribute('class') and setAttribute('class') to work in IE < 8
  elm.className = 'something';
  
  if (elm.getAttribute('class') != 'something')
  {
    Element.prototype.getAttribute = function(attr)
    {
      if (attr.toLowerCase() == 'class') {
        attr = 'className';
      }
      return this._alpha_getAttribute(attr);
    }
    
    Element.prototype.setAttribute = function(attr, value)
    {
      if (attr.toLowerCase() == 'class') {
        attr = 'className';
      }
      return this._alpha_setAttribute(attr, value);
    }
  }

  // elm.hasAttribute(name) is missing in IE < 8
  if (typeof elm.hasAttribute == 'undefined')
  {
    Element.prototype.hasAttribute = function(attr) {
      return (this.getAttribute(attr) === null) ? false : true;
    }
  }
})();

/**
 * Returns attributes as extended elements. Also permits
 * to create pseudo getters in MSIE < 8.
 * 
 * Use only if you want or need compatibility with MSIE < 8.
 * 
 *   elm.get('nextSibling');
 *   elm.get('parentNode');
 *   elm.get('children');
 *   elm.get('nextElementSibling');
 * 
 * You may also use the following syntax, in order to restricy loading of this
 * file only to Internet Explorer 6 and 7:
 * 
 *   elm.get ? elm.get('nextSibling') : elm.nextSibling
 */
Element.prototype.get = function(attribute)
{
  if (this['_alpha_get_' + attribute]) {
    return this['_alpha_get_' + attribute]();
  }
  
  if (typeof this[attribute] != 'undefined')
  {
    if (this[attribute] && this[attribute].nodeType == 1) {
      return Alpha.$(this[attribute]);
    }
    return this[attribute];
  }
}

/**
 * Emulates DOM Events in Internet Explorer.
 * 
 * - document.createEvent()
 * - Element.dispatchEvent()
 * - Element.addEventListener()
 * - Element.removeEventListener()
 * 
 * requires: compat/core.js
 * requires: compat/element/dom.js
 * requires: compat/element/element.js
 * 
 * Custom event dispatching is inspired by Prototype.js
 * by Sam Stephenson http://www.prototypejs.org/
 */

if (!Element.prototype.addEventListener)
{
  var ALPHA_CUSTOM_EVENTS_COUNT = 'data-alpha-custom-events-counter';
  
  // adds support for DOMContentLoaded
  if (document.attachEvent)
  {
    document.attachEvent('onreadystatechange', function()
    {
      if (document.readyState == 'complete')
      {
        var e = document.createEvent('HTMLEvents');
        e.initEvent('DOMContentLoaded', true, true);
        document.dispatchEvent(e);
      }
    });
  }

  // fixes the Event DOM prototype
  if (typeof Event == 'undefined') {
    Event = new Alpha.prototypeEmulator();
  }

  Event.prototype.preventDefault = function() {
    this.returnValue = false;
  }

  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
  }

  Alpha.event = function(currentTarget)
  {
    // clones current event
    var event = {};
    for (var i in window.event) {
      event[i] = window.event[i];
    }
    
    // adds missing methods
    for (var method in Event.prototype) {
      event[method] = Event.prototype[method];
    }
    
    // custom event
    if (event._alpha_event_type) {
      event.type = event._alpha_event_type;
    }
    
    // target: the element the event happened on
    if (event.target) {
      event.target = Alpha.$(event.target);
    }
    else if (event.srcElement) {
      event.target = Alpha.$(event.srcElement);
    }
    
    // currentTarget: the element that handles the event
    if (!event.currentTarget && currentTarget) {
      event.currentTarget = Alpha.$(currentTarget);
    }
    
    if (event.type == 'mouseover')
    {
      // relatedTarget: the element the mouse came from
      event.relatedTarget = Alpha.$(event.fromElement);
    }
    else if (event.type == 'mouseout')
    {
      // relatedTarget: the element the mouse left to
      event.relatedTarget = Alpha.$(event.toElement);
    }
    else {
      event.relatedTarget = null;
    }
    
    // fixes values
    event.pageX = event.clientX + document.scrollLeft;
    event.pageY = event.clientY + document.scrollTop;
    
    return event;
  }

  Element.prototype.addEventListener = function(type, listener, useCapture)
  {
    if (useCapture) {
      throw new Error("Capture mode isn't supported by MSIE (and isn't emulated).");
    }

    // creates the list of listeners to call (per type)
    if (!this._alpha_events) {
      this._alpha_events = {};
    }

    // creates the real listener for event type
    if (!this._alpha_events[type])
    {
      var self = this;
      var _event    = '_alpha_event_' + type + '_event';
      var _listener = '_alpha_event_' + type + '_listener';
      
      this._alpha_events[type] = {
        listeners: [],
        real_listener: function()
        {
          // the event object
          self[_event] = Alpha.event(self);
          
          // runs the list of listeners for event type. we use a custom launcher
          // in order for failing listeners not to stop the event dispatch.
          // see http://deanedwards.me.uk/weblog/2009/03/callbacks-vs-events/ for explanations.
          for (var i = 0, len = self._alpha_events[type].listeners.length; i < len; i++) {
            self[_listener] = self._alpha_events[type].listeners[i];
          }
          
          // copies properties for preventDefault() and stopPropagation() to have any effect
          window.event.returnValue  = self[_event].returnValue;
          window.event.cancelBubble = self[_event].cancelBubble;
        },
        custom_launcher: function(evt)
        {
          if (evt.propertyName == _listener) {
            self[_listener].call(self, self[_event]);
          }
        }
      };
      
      // attaches the real listener
      if (typeof this['on' + type] != 'undefined') {
        this.attachEvent('on' + type, this._alpha_events[type].real_listener);
      }
      else
      {
        // We can't use custom event types in IE, we thus use uncommon types,
        // and we have to listen for both (one that bubbles, and one that doesn't).
        // 
        // We also use a counter in order to not multiply the listerners, which
        // would multiple the event calls, each time we listen for a new custom
        // event.
        if (this.getAttribute(ALPHA_CUSTOM_EVENTS_COUNT) === null)
        {
          this.attachEvent('ondataavailable', this._alpha_events[type].real_listener);
          this.attachEvent('onlosecapture',   this._alpha_events[type].real_listener);
        }
        this.setAttribute(ALPHA_CUSTOM_EVENTS_COUNT, this.getAttribute(ALPHA_CUSTOM_EVENTS_COUNT) + 1);
      }
      
      this.attachEvent('onpropertychange', this._alpha_events[type].custom_launcher);
    }

    // adds the listener to internal list
    this._alpha_events[type].listeners.push(listener);
  }

  Element.prototype.removeEventListener = function(type, listener, useCapture)
  {
    if (useCapture) {
      return new Error("Capture mode isn't supported by MSIE (and isn't emulated).");
    }
    
    if (this._alpha_events)
    {
      if (this._alpha_events[type])
      {
        // removes the listener
        var idx = this._alpha_events[type].listeners.indexOf(listener);
        if (idx > -1)
        {
          delete this._alpha_events[type].listeners[idx];
          this._alpha_events[type].listeners.splice(idx, 1);
        }
        
        // no more listeners: let's detach the real one and clean up
        if (this._alpha_events[type].listeners.length == 0)
        {
          this._alpha_remove_event_listener(type);
          delete this._alpha_events[type];
        }
      }
      
      // no more listeners: let's clean up
      if (this._alpha_events.length == 0) {
        delete this._alpha_events;
      }
    }
  }

  Element.prototype.clearEvents = function()
  {
    if (this._alpha_events)
    {
      for (var type in this._alpha_events)
      {
        if (this._alpha_events[type].listeners)
        {
          for (var i=0, len=this._alpha_events[type].listeners.length; i<len; i++) {
            delete this._alpha_events[type].listeners[i];
          }
          this._alpha_remove_event_listener(type);
        }
        delete this._alpha_events[type];
      }
    }
  }

  Element.prototype._alpha_remove_event_listener = function(type)
  {
    if (typeof this['on' + type] != 'undefined') {
      this.detachEvent('on' + type, this._alpha_events[type].real_listener);
    }
    else if (this.getAttribute(ALPHA_CUSTOM_EVENTS_COUNT) == 1)
    {
      // custom event: we listen for two event types (one that bubbles, and one that doesn't)
      this.detachEvent('ondataavailable', this._alpha_events[type].real_listener);
      this.detachEvent('onlosecapture',   this._alpha_events[type].real_listener);
      this.removeAttribute(ALPHA_CUSTOM_EVENTS_COUNT);
    }
    else {
      this.setAttribute(ALPHA_CUSTOM_EVENTS_COUNT, this.getAttribute(ALPHA_CUSTOM_EVENTS_COUNT) - 1);
    }
    this.detachEvent('onpropertychange', this._alpha_events[type].custom_launcher);
  }


  // custom events

  Alpha.events = {};

  Alpha.events.Event = function() {}
  Alpha.events.Event.prototype.initEvent = function(type, canBubble, cancelable)
  {
    this.type = type;
    this.event = document.createEventObject();
    this.event.eventType = canBubble ? 'ondataavailable' : 'onlosecapture';
    this.event._alpha_event_type = type;
  }
  Alpha.events.HTMLEvents = function() {}
  Alpha.events.HTMLEvents.prototype = new Alpha.events.Event();

  document.createEvent = function(className) {
    return new Alpha.events[className];
  }

  Element.prototype.dispatchEvent = function(event)
  {
    for (var i in event)
    {
      if (i != 'type' && i != 'event'
        && typeof event.event[i] == undefined)
      {
        event.event[i] = event;
      }
    }
    return this.fireEvent(event.event.eventType, event.event);
  }

  document.addEventListener    = Element.prototype.addEventListener;
  document.removeEventListener = Element.prototype.removeEventListener;
  document.clearEvents         = Element.prototype.clearEvents;
  document.dispatchEvent       = Element.prototype.dispatchEvent;

  document.documentElement.addEventListener    = Element.prototype.addEventListener;
  document.documentElement.removeEventListener = Element.prototype.removeEventListener;
  document.documentElement.clearEvents         = Element.prototype.clearEvents;
  document.documentElement.dispatchEvent       = Element.prototype.dispatchEvent;

  window.addEventListener = function(type, listener, useCapture) {
    return document.documentElement.addEventListener(type, listener, useCapture);
  }
  window.removeEventListener = function(type, listener, useCapture) {
    return document.documentElement.removeEventListener(type, listener, useCapture);
  }
  window.clearEvents = function() {
    return document.documentElement.clearEvents();
  }
  window.dispatchEvent = function(event) {
    return document.documentElement.dispatchEvent(event);
  }

  document.body.addEventListener    = Element.prototype.addEventListener;
  document.body.removeEventListener = Element.prototype.removeEventListener;
  document.body.clearEvents         = Element.prototype.clearEvents;
  document.body.dispatchEvent       = Element.prototype.dispatchEvent;
}
// window dimensions are undefined in IE
if (typeof window.innerWidth == 'undefined')
{
  if (Object.defineProperty)
  {
    // IE 8
    Object.defineProperty(window, 'innerWidth', {get: function() {
      return document.documentElement.clientWidth;
    }});
    Object.defineProperty(window, 'innerHeight', {get: function() {
      return document.documentElement.clientHeight;
    }});
    Object.defineProperty(window, 'pageXOffset', {get: function() {
      return document.documentElement.scrollWidth;
    }});
    Object.defineProperty(window, 'pageYOffset', {get: function() {
      return document.documentElement.scrollHeight;
    }});
  }
  else
  {
    // IE 6-7
    Alpha.__msie_onresize = function()
    {
      window.innerWidth  = document.documentElement.clientWidth;
      window.innerHeight = document.documentElement.clientHeight;
      window.pageXOffset = document.documentElement.scrollWidth;
      window.pageYOffset = document.documentElement.scrollHeight;
    }
    Alpha.__msie_onresize();
    window.attachEvent('onresize', Alpha.__msie_onresize);
  }
}

/**
 * Implements querySelectorAll and querySelector when missing.
 * 
 * This is a fork of Sly v1.0rc2 <http://sly.digitarald.com>
 * Copyright (c) 2009 Harald Kirschner <http://digitarald.de>
 * Open source under MIT License
 * 
 * Sly's code and pattern are inspired by several open source developers.
 * 
 * Valerio Proietti & MooTools contributors
 *  - Idea of modular combinator and pseudo filters
 *  - Code for several pseudo filters
 *  - Slickspeed benchmark framework
 * Steven Levithan
 *  - Improved Sly.parse expression
 * Diego Perini
 *  - Research on querySelectorAll and browser quirks
 *  - Patches for Sly.parse expression
 *  - Combined tests from jQuery and Prototype
 * Thomas Aylott & Slick contributors
 *   - Idea of using regular expressions in attribute filter.
 * John Resig & jQuery/Sizzle contributors
 *  - Browser feature/quirks detection
 *  - Additional pseudo filters
 *  - Extensive Unit Tests, (c) 2008 John Resig, Jörn Zaefferer, MIT/GPL dual license
 * Sam Stephenson & Prototype contributors
 *  - Extensive Unit Tests, (c) 2005-2008 Sam Stephenson, MIT-style license
 * Alan Kang & JSSpec contributors
 *  - JSSpec BDD framework
 * 
 * 
 * Modifications from original Sly:
 * 
 *  - implements querySelector() & querySelectorAll().
 *  - use of querySelectorAll() has been removed (no use, we actually replace it when missing or obviously limited).
 *  - non standard selectors/operators have been removed (ie :contains).
 *  - integrated missing CSS 3 pseudo selectors (ie. :root and :target).
 * 
 * Lacks:
 * 
 *  - support for HTML5 elements in IE (that's IE's fault).
 */

if (!Element.prototype.querySelectorAll || Alpha.browser.ie)
{
  var Sly   = (function()
  {
    var cache = {};

    /**
     * Sly::constructor
     * 
     * Acts also as shortcut for Sly::search if context argument is given.
     */
    var Sly = function(text, context, results, options) {
	    // normalise
	    text = (typeof(text) == 'string') ? text.replace(/^\s+|\s+$/, '') : '';
	
	    var cls = cache[text] || (cache[text] = new Sly.initialize(text));
	    return (context == null) ? cls : cls.search(context, results, options);
    };

    Sly.initialize = function(text) {
	    this.text = text;
    };

    var proto = Sly.initialize.prototype = Sly.prototype;


    /**
     * Sly.implement
     */
    Sly.implement = function(key, properties) {
	    for (var prop in properties) Sly[key][prop] = properties[prop];
    };


    /**
     * Sly.support
     *
     * Filled with experiment results.
     */
    var support = Sly.support = {};

    // Checks similar to NWMatcher, Sizzle
    (function() {
	
	    // Our guinea pig
	    var testee = document.createElement('div'), id = (new Date()).getTime();
	    testee.innerHTML = '<a name="' + id + '" class="€ b"></a>';
	    testee.appendChild(document.createComment(''));
	
	    // IE returns comment nodes for getElementsByTagName('*')
	    support.byTagAddsComments = (testee.getElementsByTagName('*').length > 1);
	
	    // Safari can't handle uppercase or unicode characters when in quirks mode.
//	    support.hasQsa = !!(testee.querySelectorAll && testee.querySelectorAll('.€').length);
	
	    support.hasByClass = (function() {
		    if (!testee.getElementsByClassName || !testee.getElementsByClassName('b').length) return false;
		    testee.firstChild.className = 'c';
		    return (testee.getElementsByClassName('c').length == 1);
	    })();
	
	    var root = document.documentElement;
	    root.insertBefore(testee, root.firstChild);
	
	    // IE returns named nodes for getElementById(name)
	    support.byIdAddsName = !!(document.getElementById(id));
	
	    root.removeChild(testee);
	
    })();


    var locateFast = function() {
	    return true;
    };

    /**
     * Sly::search
     */
    proto.search = function(context, results, options) {
	    options = options || {};
	
	    var iterate, i, item;

	    if (!context) {
		    context = document;
	    } else if (context.nodeType != 1 && context.nodeType != 9) {
		    if (typeof(context) == 'string') {
			    context = Sly.search(context);
			    iterate = true;
		    } else if (Object.prototype.toString.call(context) == '[object Array]' || (typeof(context.length) == 'number' && context.item)) { // simple isArray
			    var filtered = [];
			    for (i = 0; (item = context[i]); i++) {
				    if (item.nodeType == 1 || item.nodeType == 9) filtered.push(item);
			    }
			    iterate = (filtered.length > 1);
			    context = (iterate) ? filtered : (filtered[0] || document);
		    }
	    }
	
	    var mixed, // results need to be sorted, comma
		    combined, // found nodes from one iteration process
		    nodes, // context nodes from one iteration process
		    all = {}, // unique ids for overall result
		    state = {}; // matchers temporary state
	    var current = all; // unique ids for one iteration process

	    // unifiers
	    var getUid = Sly.getUid;
	    var locateCurrent = function(node) {
		    var uid = getUid(node);
		    return (current[uid]) ? null : (current[uid] = true);
	    };
	
	    if (results && results.length) { // fills unique ids, does not alter the given results
		    for (i = 0; (item = results[i]); i++) locateCurrent(item);
	    }
	    
      /*
	    if (support.hasQsa && !iterate && context.nodeType == 9 && !(/\[/).test(this.text)) {
		    try {
			    var query = context.querySelectorAll(this.text);
		    } catch(e) {}
		    if (query) {
			    if (!results) return Sly.toArray(query);
			    for (i = 0; (item = query[i]); i++) {
				    if (locateCurrent(item)) results.push(item);
			    }
			    if (!options.unordered) results.sort(Sly.compare);
			    return results;
		    }
	    }
	    */

	    var parsed = this.parse();
	    if (!parsed.length) return [];

	    for (var i = 0, selector; (selector = parsed[i]); i++) {

		    var locate = locateCurrent;

		    if (selector.first) {
			    if (!results) locate = locateFast;
			    else mixed = true;
			    if (iterate) nodes = context;
			    else if (selector.combinator) nodes = [context]; // allows combinators before selectors
		    }

		    if (selector.last && results) {
			    current = all;
			    combined = results;
		    } else {
			    // default stack
			    current = {};
			    combined = [];
		    }

		    if (!selector.combinator && !iterate) {
			    // without prepended combinator
			    combined = selector.combine(combined, context, selector, state, locate, !(combined.length));
		    } else {
			    // with prepended combinators
			    for (var k = 0, l = nodes.length; k < l; k++) {
				    combined = selector.combine(combined, nodes[k], selector, state, locate);
			    }
		    }

		    if (selector.last) {
			    if (combined.length) results = combined;
		    } else {
			    nodes = combined;
		    }
	    }

	    if (!options.unordered && mixed && results) results.sort(Sly.compare);

	    return results || [];
    };

    /**
     * Sly::find
     */
    proto.find = function(context, results, options) {
	    return this.search(context, results, options)[0];
    };


    /**
     * Sly::match
     */
    proto.match = function(node, parent) {
	    var parsed = this.parse();
	    if (parsed.length == 1) return !!(this.parse()[0].match(node, {}));
	    if (!parent) {
		    parent = node;
		    while (parent.parentNode) parent = parent.parentNode
	    }
	    var found = this.search(parent), i = found.length;
	    if (!i--) return false;
	    while (i--) {
		    if (found[i] == node) return true;
	    }
	    return false;
    };


    /**
     * Sly::filter
     */
    proto.filter = function(nodes) {
	    var results = [], match = this.parse()[0].match;
	    for (var i = 0, node; (node = nodes[i]); i++) {
		    if (match(node)) results.push(node);
	    }
	    return results;
    };


    /**
     * Sly.recompile()
     */
    var pattern;

    Sly.recompile = function() {

	    var key, combList = [','], operList = ['!'];

	    for (key in combinators) {
		    if (key != ' ') {
			    combList[(key.length > 1) ? 'unshift' : 'push'](Sly.escapeRegExp(key));
		    }
	    }
	    for (key in operators) operList.push(key);

	    /**
		    The regexp is a group of every possible selector part including combinators.
		    "|" separates the possible selectors.

		    Capturing parentheses:
		    1 - Combinator (only requires to allow multiple-character combinators)
		    2 - Attribute name
		    3 - Attribute operator
		    4, 5, 6 - The value
		    7 - Pseudo name
		    8, 9, 10 - The value
	     */

	    pattern = new RegExp(
		    // A tagname
		    '[\\w\\u00a1-\\uFFFF][\\w\\u00a1-\\uFFFF-]*|' +

		    // An id or the classname
		    '[#.](?:[\\w\\u00a1-\\uFFFF-]|\\\\:|\\\\.)+|' +

		    // Whitespace (descendant combinator)
		    '[ \\t\\r\\n\\f](?=[\\w\\u00a1-\\uFFFF*#.[:])|' +

		    // Other combinators and the comma
		    '[ \\t\\r\\n\\f]*(' + combList.join('|') + ')[ \\t\\r\\n\\f]*|' +

		    // An attribute, with the various and optional value formats ([name], [name=value], [name="value"], [name='value']
		    '\\[([\\w\\u00a1-\\uFFFF-]+)[ \\t\\r\\n\\f]*(?:([' + operList.join('') + ']?=)[ \\t\\r\\n\\f]*(?:"([^"]*)"|\'([^\']*)\'|([^\\]]*)))?]|' +

		    // A pseudo-class, with various formats
		    ':([-\\w\\u00a1-\\uFFFF]+)(?:\\((?:"([^"]*)"|\'([^\']*)\'|([^)]*))\\))?|' +

		    // The universial selector, not process
		    '\\*|(.+)', 'g'
	    );
    };


    // I prefer it outside, not sure if this is faster
    var create = function(combinator) {
	    return {
		    ident: [],
		    classes: [],
		    attributes: [],
		    pseudos: [],
		    combinator: combinator
	    };
    };

    var blank = function($0) {
	    return $0;
    };

    /**
     * Sly::parse
     *
     * Returns an array with one object for every selector:
     *
     * {
     *   tag: (String) Tagname (defaults to null for universal *)
     *   id: (String) Id
     *   classes: (Array) Classnames
     *   attributes: (Array) Attribute objects with "name", "operator" and "value"
     *   pseudos: (Array) Pseudo objects with "name" and "value"
     *   operator: (Char) The prepended operator (not comma)
     *   first: (Boolean) true if it is the first selector or the first after a comma
     *   last: (Boolean) true if it is the last selector or the last before a comma
     *   ident: (Array) All parsed matches, can be used as cache identifier.
     * }
     */
    proto.parse = function(plain) {
	    var save = (plain) ? 'plain' : 'parsed';
	    if (this[save]) return this[save];
	
	    var text = this.text;
	    var compute = (plain) ? blank : this.compute;

	    var parsed = [], current = create(null);
	    current.first = true;

	    var refresh = function(combinator) {
		    parsed.push(compute(current));
		    current = create(combinator);
	    };

	    pattern.lastIndex = 0; // to fix some weird behavior
	    var match, $0;
	
	    while ((match = pattern.exec(text))) {
		
		    if (match[11]) {
			    if (Sly.verbose) throw SyntaxError('Syntax error, "' + $0 + '" unexpected at #' + pattern.lastIndex + ' in "' + text + '"');
			    return (this[save] = []);
		    }
		
		    $0 = match[0];
		
		    switch ($0.charAt(0)) {
			    case '.':
				    current.classes.push($0.slice(1).replace(/\\/g, ''));
				    break;
			    case '#':
				    current.id = $0.slice(1).replace(/\\/g, '');
				    break;
			    case '[':
				    current.attributes.push({
					    name: match[2],
					    operator: match[3] || null,
					    value: match[4] || match[5] || match[6] || null
				    });
				    break;
			    case ':':
				    current.pseudos.push({
					    name: match[7],
					    value: match[8] || match[9] || match[10] || null
				    });
				    break;
			    case ' ': case '\t': case '\r': case '\n': case '\f':
				    match[1] = match[1] || ' ';
			    default:
				    var combinator = match[1];
				    if (combinator) {
					    if (combinator == ',') {
						    current.last = true;
						    refresh(null);
						    current.first = true;
						    continue;
					    }
					    if (current.first && !current.ident.length) current.combinator = combinator;
					    else refresh(combinator);
				    } else {
					    if ($0 != '*') current.tag = $0;
				    }
		    }
		    current.ident.push($0);
	    }

	    current.last = true;
	    parsed.push(compute(current));

	    return (this[save] = parsed);
    };


    // chains two given functions

    function chain(prepend, append, aux, unshift) {
	    return (prepend) ? ((unshift) ? function(node, state) {
		    return append(node, aux, state) && prepend(node, state);
	    } : function(node, state) {
		    return prepend(node, state) && append(node, aux, state);
	    }) : function(node, state) {
		    return append(node, aux, state);
	    };
	    // fn.$slyIndex = (prepend) ? (prepend.$slyIndex + 1) : 0;
    };


    // prepared match comperators, probably needs namespacing
    var empty = function() {
	    return true;
    };

    var matchId = function(node, id) {
	    return (node.id == id);
    };

    var matchTag = function(node, tag) {
	    return (node.nodeName.toUpperCase() == tag);
    };

    var prepareClass = function(name) {
	    return (new RegExp('(?:^|[ \\t\\r\\n\\f])' + name + '(?:$|[ \\t\\r\\n\\f])'));
    };

    var matchClass = function(node, expr) {
	    return node.className && expr.test(node.className);
    };

    var prepareAttribute = function(attr) {
	    attr.getter = Sly.lookupAttribute(attr.name) || Sly.getAttribute;
	    if (!attr.operator || !attr.value) return attr;
	    var parser = operators[attr.operator];
	    if (parser) { // @todo: Allow functions, not only regex
		    attr.escaped = Sly.escapeRegExp(attr.value);
		    attr.pattern = new RegExp(parser(attr.value, attr.escaped, attr));
	    }
	    return attr;
    };

    var matchAttribute = function(node, attr) {
	    var read = attr.getter(node, attr.name);
	    switch (attr.operator) {
		    case null: return read;
		    case '=': return (read == attr.value);
		    case '!=': return (read != attr.value);
	    }
	    if (!read && attr.value) return false;
	    return attr.pattern.test(read);
    };


    /**
     * Sly::compute
     *
     * Attaches the following methods to the selector object:
     *
     * {
     *   search: Uses the most convinient properties (id, tag and/or class) of the selector as search.
     *   matchAux: If search does not contain all selector properties, this method matches an element against the rest.
     *   match: Matches an element against all properties.
     *   simple: Set when matchAux is not needed.
     *   combine: The callback for the combinator
     * }
     */
    proto.compute = function(selector) {

	    var i, item, match, search, matchSearch, tagged,
		    tag = selector.tag,
		    id = selector.id,
		    classes = selector.classes;

	    var nodeName = (tag) ? tag.toUpperCase() : null;

	    if (id) {
		    tagged = true;

		    matchSearch = chain(null, matchId, id);

		    search = function(context) {
			    if (context.getElementById) {
				    var el = context.getElementById(id);
				    return (el
					    && (!nodeName || el.nodeName.toUpperCase() == nodeName)
					    && (!support.getIdAdds || el.id == id))
						    ? [el]
						    : [];
			    }

			    var query = context.getElementsByTagName(tag || '*');
			    for (var j = 0, node; (node = query[j]); j++) {
				    if (node.id == id) return [node];
			    }
			    return [];
		    };
	    }

	    if (classes.length > 0) {

		    if (!search && support.hasByClass) {

			    for (i = 0; (item = classes[i]); i++) {
				    matchSearch = chain(matchSearch, matchClass, prepareClass(item));
			    }

			    var joined = classes.join(' ');
			    search = function(context) {
				    return context.getElementsByClassName(joined);
			    };

		    } else if (!search && classes.length == 1) { // optimised for typical .one-class-only

			    tagged = true;

			    var expr = prepareClass(classes[0]);
			    matchSearch = chain(matchSearch, matchClass, expr);

			    search = function(context) {
				    var query = context.getElementsByTagName(tag || '*');
				    var found = [];
				    for (var i = 0, node; (node = query[i]); i++) {
					    if (node.className && expr.test(node.className)) found.push(node);
				    }
				    return found;
			    };

		    } else {

			    for (i = 0; (item = classes[i]); i++) {
				    match = chain(match, matchClass, prepareClass(item));
			    }

		    }
	    }

	    if (tag) {

		    if (!search) {
			    matchSearch = chain(matchSearch, matchTag, nodeName);

			    search = function(context) {
				    return context.getElementsByTagName(tag);
			    };
		    } else if (!tagged) { // search does not filter by tag yet
			    match = chain(match, matchTag, nodeName);
		    }

	    } else if (!search) { // default engine

		    search = function(context) {
			    var query = context.getElementsByTagName('*');
			    if (!support.byTagAddsComments) return query;
			    var found = [];
			    for (var i = 0, node; (node = query[i]); i++) {
				    if (node.nodeType === 1) found.push(node);
			    }
			    return found;
		    };

	    }

	    for (i = 0; (item = selector.pseudos[i]); i++) {

		    if (item.name == 'not') { // optimised :not(), fast as possible
			    var not = Sly(item.value);
			    match = chain(match, function(node, not) {
				    return !not.match(node);
			    }, (not.parse().length == 1) ? not.parsed[0] : not);
		    } else {
			    var parser = pseudos[item.name];
			    if (parser) match = chain(match, parser, item.value);
		    }

	    }

	    for (i = 0; (item = selector.attributes[i]); i++) {
		    match = chain(match, matchAttribute, prepareAttribute(item));
	    }

	    if ((selector.simple = !(match))) {
		    selector.matchAux = empty;
	    } else {
		    selector.matchAux = match;
		    matchSearch = chain(matchSearch, match);
	    }

	    selector.match = matchSearch || empty;

	    selector.combine = Sly.combinators[selector.combinator || ' '];

	    selector.search = search;

	    return selector;
    };

    // Combinators/Pseudos partly from MooTools 1.2-pre, (c) 2006-2009 Valerio Proietti, MIT License

    /**
     * Combinators
     */
    var combinators = Sly.combinators = {

	    ' ': function(combined, context, selector, state, locate, fast) {
		    var nodes = selector.search(context);
		    if (fast && selector.simple) return Sly.toArray(nodes);
		    for (var i = 0, node, aux = selector.matchAux; (node = nodes[i]); i++) {
			    if (locate(node) && aux(node, state)) combined.push(node);
		    }
		    return combined;
	    },

	    '>': function(combined, context, selector, state, locate) {
		    var nodes = selector.search(context);
		    for (var i = 0, node; (node = nodes[i]); i++) {
			    if (node.parentNode == context && locate(node) && selector.matchAux(node, state)) combined.push(node);
		    }
		    return combined;
	    },

	    '+': function(combined, context, selector, state, locate) {
		    while ((context = context.nextSibling)) {
			    if (context.nodeType == 1) {
				    if (locate(context) && selector.match(context, state)) combined.push(context);
				    break;
			    }

		    }
		    return combined;
	    },

	    '~': function(combined, context, selector, state, locate) {
		    while ((context = context.nextSibling)) {
			    if (context.nodeType == 1) {
				    if (!locate(context)) break;
				    if (selector.match(context, state)) combined.push(context);
			    }
		    }
		    return combined;
	    }

    };


    /**
     * Pseudo-Classes
     */
    var pseudos = Sly.pseudos = {

	    // w3c pseudo classes

	    'first-child': function(node) {
		    return pseudos.index(node, 0);
	    },

	    'last-child': function(node) {
		    while ((node = node.nextSibling)) {
			    if (node.nodeType === 1) return false;
		    }
		    return true;
	    },

	    'only-child': function(node) {
		    var prev = node;
		    while ((prev = prev.previousSibling)) {
			    if (prev.nodeType === 1) return false;
		    }
		    var next = node;
		    while ((next = next.nextSibling)) {
			    if (next.nodeType === 1) return false;
		    }
		    return true;
	    },

	    'nth-child': function(node, value, state) {
		    var parsed = Sly.parseNth(value || 'n');
		    if (parsed.special != 'n') return pseudos[parsed.special](node, parsed.a, state);
		    state = state || {}; // just to be sure
		    state.positions = state.positions || {};
		    var uid = Sly.getUid(node) ;
		    if (!state.positions[uid]) {
			    var count = 0;
			    while ((node = node.previousSibling)) {
				    if (node.nodeType != 1) continue;
				    count++;
				    var position = state.positions[Sly.getUid(node)];
				    if (position != undefined) {
					    count = position + count;
					    break;
				    }
			    }
			    state.positions[uid] = count;
		    }
		    return (state.positions[uid] % parsed.a == parsed.b);
	    },

	    'empty': function(node) {
		    return !(node.innerText || node.textContent || '').length;
	    },

	    'index': function(node, index) {
		    var count = 1;
		    while ((node = node.previousSibling)) {
			    if (node.nodeType == 1 && ++count > index) return false;
		    }
		    return (count == index);
	    },

	    'even': function(node, value, state) {
		    return pseudos['nth-child'](node, '2n+1', state);
	    },

	    'odd': function(node, value, state) {
		    return pseudos['nth-child'](node, '2n', state);
	    },

	    // http://www.w3.org/TR/css3-selectors/#root-pseudo
	    'root': function(node) {
		    return (node.parentNode == node.ownerDocument);
	    },

      // http://www.w3.org/TR/css3-selectors/#target-pseudo
      'target': function(node) {
        var hash = location.hash;
        return (node.id && hash && node.id == hash.slice(1));
      }
    };

    pseudos.first = pseudos['first-child'];
    pseudos.last = pseudos['last-child'];
    pseudos.nth = pseudos['nth-child'];
    pseudos.eq = pseudos.index;


    /**
     * Attribute operators
     */
    var operators = Sly.operators = {

	    '*=': function(value, escaped) {
		    return escaped;
	    },

	    '^=': function(value, escaped) {
		    return '^' + escaped;
	    },

	    '$=': function(value, escaped) {
		    return value + '$';
	    },

	    '~=': function(value, escaped) {
		    return '(?:^|[ \\t\\r\\n\\f])' + escaped + '(?:$|[ \\t\\r\\n\\f])';
	    },

	    '|=': function(value, escaped) {
		    return '(?:^|\\|)' + escaped + '(?:$|\\|)';
	    }

    };


    // public, overridable

    /**
     * Sly.getAttribute & Sly.lookupAttribute
     * 
     * @todo add more translations
     */
    var translate = {
	    'class': 'className'
    }

    Sly.lookupAttribute = function(name) {
	    var prop = translate[name];
	    if (prop) {
		    return function(node) {
			    return node[prop];
		    }
	    }
	    var flag = /^(?:src|href|action)$/.test(name) ? 2 : 0;
	    return function(node) {
		    return node.getAttribute(name, flag);
	    }
    };

    Sly.getAttribute = function(node, name) {
	    return node.getAttribute(name);
    };

    /**
     * Sly.toArray
     */
    var toArray = Array.slice || function(nodes) {
	    return Array.prototype.slice.call(nodes);
    };

    try {
	    toArray(document.documentElement.childNodes);
    } catch (e) {
	    toArray = function(nodes) {
		    if (nodes instanceof Array) return nodes;
		    var i = nodes.length, results = new Array(i);
		    while (i--) results[i] = nodes[i];
		    return results;
	    };
    }

    Sly.toArray = toArray;

    Sly.compare = (document.compareDocumentPosition) ? function (a, b) {
	    return (3 - (a.compareDocumentPosition(b) & 6));
    } : function (a, b) {
	    return (a.sourceIndex - b.sourceIndex);
    };

    /**
     * Sly.getUid
     */
    var nextUid = 1;

    Sly.getUid = (window.ActiveXObject) ? function(node) {
	    return (node.$slyUid || (node.$slyUid = {id: nextUid++})).id;
    } : function(node) {
	    return node.$slyUid || (node.$slyUid = nextUid++);
    };


    var nthCache = {};

    Sly.parseNth = function(value) {
	    if (nthCache[value]) return nthCache[value];

	    var parsed = value.match(/^([+-]?\d*)?([a-z]+)?([+-]?\d*)?$/);
	    if (!parsed) return false;

	    var a = parseInt(parsed[1], 10), b = (parseInt(parsed[3], 10) || 0) - 1;

	    if ((a = (isNaN(a)) ? 1 : a)) {
		    while (b < 1) b += a;
		    while (b >= a) b -= a;
	    }
	    switch (parsed[2]) {
		    case 'n': parsed = {a: a, b: b, special: 'n'}; break;
		    case 'odd': parsed = {a: 2, b: 0, special: 'n'}; break;
		    case 'even': parsed = {a: 2, b: 1, special: 'n'}; break;
		    case 'first': parsed = {a: 0, special: 'index'}; break;
		    case 'last': parsed = {special: 'last-child'}; break;
		    case 'only': parsed = {special: 'only-child'}; break;
		    default: parsed = {a: (a) ? (a - 1) : b, special: 'index'};
	    }

	    return (nthCache[value] = parsed);
    };


    Sly.escapeRegExp = function(text) {
	    return text.replace(/[-.*+?^${}()|[\]\/\\]/g, '\\$&');
    };


    // generic accessors

    Sly.generise = function(name) {
	    Sly[name] = function(text) {
		    var cls = Sly(text);
		    return cls[name].apply(cls, Array.prototype.slice.call(arguments, 1));
	    }
    };

    var generics = ['parse', 'search', 'find', 'match', 'filter'];
    for (var i = 0; generics[i]; i++)
      Sly.generise(generics[i]);

    // compile pattern for the first time
    Sly.recompile();

    return Sly;
  })();
  
  Element.prototype.querySelectorAll = function(cssRule) {
    return Sly.search(cssRule, this);
  }
  
  Element.prototype.querySelector = function(cssRule) {
    return Sly.find(cssRule, this);
  }
  
  document.querySelectorAll = function(cssRule) {
    return Sly.search(cssRule, document);
  }
  
  document.querySelector = function(cssRule) {
    return Sly.find(cssRule, document);
  }
}
  
// Shortcut: $$ => document.querySelectorAll.
if (typeof window.$$ == "undefined") {
  window.$$ = document.querySelectorAll;
}

/**
 * Original code developed by Robert Nyman, http://www.robertnyman.com
 * Code/licensing: http://code.google.com/p/getelementsbyclassname/
 */

if (!document.getElementsByClassName)
{
  /*if (document.querySelectorAll)
  {
    // querySelectorAll (MSIE 8)
    // deactivated, because we will overwrite querySelectorAll (and there is
    // no way to call/apply a renamed native function).
    Element.prototype._msie_querySelectorAll = Element.prototype.querySelectorAll;
    Alpha.getElementsByClassName = function(parent, className)
    {
      var classes = className.split(" ");
      var cssRule = "";

      for (var i=0, ilen = classes.length; i<ilen; i++) {
        cssRule += (classes[i][0] == '.') ? classes[i] : '.' + classes[i];
      }
      return Element.prototype._msie_querySelectorAll.call(this, cssRule);
//      return this.querySelectorAll(cssRule);
    }
  }
  else*/ if (document.evaluate)
  {
    // XPATH
    Alpha.getElementsByClassName = function(parent, className)
    {
      var classes = className.split(" ");
      var classesToCheck = "";
      var xhtmlNamespace = "http://www.w3.org/1999/xhtml";
      var namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace) ? xhtmlNamespace : null;
      var returnElements = [];
      var elements;
      var node;

      for (var i=0, ilen = classes.length; i<ilen; i++) {
        classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[i] + " ')]";
      }

      try	{
        elements = document.evaluate(".//*" + classesToCheck, parent, namespaceResolver, 0, null);
      }
      catch (e) {
        elements = document.evaluate(".//*" + classesToCheck, parent, null, 0, null);
      }

      while ((node = elements.iterateNext())) {
        returnElements.push(node);
      }
      return new Alpha.NodeList(returnElements);
    }
  }
  else
  {
    // DOM PARSING (IE6+, IE7, etc.)
    Alpha.getElementsByClassName = function(parent, className)
    {
      var classes = className.split(" ");
      var classesToCheck = [];
      var elements = (parent.all) ? parent.all : parent.getElementsByTagName('*');
      var current;
      var returnElements = [];
      var match;

      for (var i=0, ilen=classes.length; i<ilen; i++) {
        classesToCheck.push(new RegExp("(^|\\s)" + classes[i] + "(\\s|$)", 'i'));
      }

      for (var i=0, ilen=elements.length; i<ilen; i++)
      {
        current = elements[i];
        match   = false;

        for (var j=0, jlen=classesToCheck.length; j<jlen; j++)
        {
          match = classesToCheck[j].test(current.className);
          if (!match) {
            break;
          }
        }

        if (match) {
          returnElements.push(current);
        }
      }

      returnElements = Alpha.extendElements ? Alpha.extendElements(returnElements) : returnElements;
      return new Alpha.NodeList(returnElements);
    }
  }

  Element.prototype.getElementsByClassName = function(className) {
    return Alpha.getElementsByClassName(this, className);
  }

  document.getElementsByClassName = function(className) {
    return Alpha.getElementsByClassName(document, className);
  }
}

// Code extracted from http://en.wikipedia.org/wiki/XMLHttpRequest
if (typeof XMLHttpRequest == "undefined")
{
  XMLHttpRequest = function()
  {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch(e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch(e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP");     } catch(e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP");  } catch(e) {}
    throw new Error("This browser does not support XMLHttpRequest.");
  };
}
/*
    http://www.JSON.org/json2.js
    2008-11-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html

    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the object holding the key.

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.

    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.
*/

/*jslint evil: true */

/*global JSON */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    JSON = {};
}
(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z';
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
})();
