/*
Alpha.mergeObjects = function()
{
  var obj = [];
  for (var i=0, len=arguments.length; i<len; i++)
  {
    for (var key in arguments[i]) {
      obj[key] = arguments[i][key];
    }
  }
  return obj;
}

Alpha.mergeArrays = function()
{
  var ary = [];
  var i = arguments.length;
  while (i--)
  {
    Array.prototype.forEach.call(arguments[i], function(member)
    {
      if (ary.indexOf(member) == -1) {
        ary.push(member);
      }
    });
  }
  return ary;
}
*/

/**
 * Creates an anonymous function, binded to a particular scope.
 */
Function.prototype.bind = function(bind)
{
  var self = this;
  return function() {
	  self.apply(bind, arguments);
  }
}

/**
// * Creates an anonymous function, that will be called with
// * some arguments.
// */
//Function.prototype.pass = function(args, bind)
//{
//	var self = this;
//	return function() {
//		self.apply(bind || self, args || []);
//	}
//}

///**
// * Delays the execution of a function.
// */
//Function.prototype.delay = function(delay, bind, args)
//{
//	var self = this;
//	return setTimeout(function() {
//		self.apply(bind || self, args || []);
//	}, delay);
//}

///**
// * Bufferizes a call to a function.
// * 
// * The buffered function will be called once, and only once,
// * when the delay expires. Just debounce it again to delay the
// * execution again and again.
// * 
// * Eg: you want to run function once the user stops to write
// * something.
// *
// * <code>
// * elm.addEventListener('keyup', my_listener.debounce(300, elm), false);
// * </code>
// */
//Function.prototype.debounce = function(delay, bind, args)
//{
//	var self = this, timer;
//	return function()
//	{
//		clearTimeout(timer);
//		timer = self.delay(delay, bind, args || []);
//	}
//}

String.prototype.camelize = function(index)
{
  var parts = this.split(/[-_]/);
  var str = '';
  if (typeof index == 'undefined') {
    index = 1;
  }
  for (var i=0; i<index; i++) {
    str += parts[i];
  }
  for (var i=index; i<parts.length; i++)
  {
    str += parts[i].substr(0, 1).toUpperCase();
    str += parts[i].substr(1);
  }
  return str;
}

String.prototype.hyphenize = function()
{
  var parts = this.split(/([A-Z].+)/);
  var str = '';
  for (var i=0; i<parts.length; i++)
  {
    if (parts[i] != '') {
      str += parts[i].toLowerCase() + '-';
    }
  }
  return str.replace(/[-]+$/, '');
}

Element.prototype.insertAfter = function(newElement, referenceElement)
{
  if (!referenceElement) {
    this.appendChild(newElement);
  }
  else
  {
    var nextSibling = referenceElement.nextSibling;
    this.insertBefore(newElement, nextSibling);
  }
  return newElement;
}

Element.prototype.getPosition = function(parent)
{
  var position = {x: 0, y: 0};
  if (this.offsetParent)
  {
    var obj = this;
    do
    {
      position.x += obj.offsetLeft;
      position.y += obj.offsetTop;
    }
    while (obj = obj.offsetParent)
  }
  return position;
}

if (!Element.prototype.hasClassName)
{
  Element.prototype.hasClassName = function(className)
  {
	  var re = new RegExp("(^|\\s)" + className + "(\\s|$)", 'i');
	  return re.test(this.className);
  }
}

if (!Element.prototype.addClassName)
{
  Element.prototype.addClassName = function(className)
  {
	  if (!this.hasClassName(className))
	  {
		  this.className += ' ' + className;
		  this.className = this.className.replace(/\s+/g, ' ');
	  }
  }
}

if (!Element.prototype.removeClassName)
{
  Element.prototype.removeClassName = function(className)
  {
	  var re = new RegExp("(^|\\s)" + className + "(\\s|$)", 'i');
	  this.className = this.className.replace(re, ' ').replace(/\s+/g, ' ');
  }
}

if (!Element.prototype.toggleClassName)
{
  Element.prototype.toggleClassName = function(className)
  {
    if (this.hasClassName(className)) {
      this.removeClassName(className);
    }
    else {
      this.addClassName(className);
    }
  }
}

// I don't like this, but Alpha.getStyle(element, property) wouldn't be any
// prettier, and there is the cross-browser opacity property problem :(

Element.prototype.setStyle = function(property, value)
{
  if (typeof property == 'object')
  {
    for (var p in property) {
      this.setStyle(p, property[p]);
    }
  }
  else
  {
    if (property == 'opacity')
    {
      this.style.cssText += ';-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (value * 100) + ')";' +
        'filter:alpha(opacity=' + Math.round(value * 100) + ');zoom:1;opacity:' + value;
    }
    else {
      this.style.cssText += ';' + property.hyphenize() + ':' + value;
    }
  }
}

Element.prototype.getStyle = function(property)
{
  if (window.getComputedStyle) {
    var v = document.defaultView.getComputedStyle(this, null).getPropertyValue(property);
  }
  else if (this.currentStyle)
  {
    if (property == 'opacity')
    {
      var alpha = this.filters["DXImageTransform.Microsoft.Alpha"] || this.filters.alpha || {};
      return (alpha.opacity || 100) / 100.0;
    }
    var v = this.currentStyle[property.camelize()];
  }

  if (Alpha.Color
    && (v.indexOf('#') > -1 || v.indexOf('rgb') > -1 || v.indexOf('rgba') > -1))
  {
    var v = new Alpha.Color(v);
  }
  return v;
}

/**
 * Serializes an HTML form into an application/x-www-form-urlencoded string.
 * 
 * Example:
 * 
 *   var form = document.getElementById('update_product_1');
 *   
 *   var params = new Serializer();
 *   params.serialize(form);
 *   params.append('_method', 'put');
 *   
 *   var xhr = new XMLHttpRequest();
 *   xhr.open('POST', form);
 *   xhr.send(params.toString());
 * 
 * IMPROVE: use selectedOptions for <select multiple/>
 */

Alpha.Serializer = function() {
  this.data = '';
}

Alpha.Serializer.prototype.serialize = function(form)
{
  var inputs = form.querySelectorAll('input,select,textarea');
  Array.prototype.forEach.call(inputs, function(input)
  {
    if (!input.name
      || input.disabled
      || input.type == 'file'
      || (input.type == 'checkbox' && !input.checked)
      || (input.type == 'submit' && !input.hasAttribute('submitted')))
    {
      return;
    }
    if (input.type == 'select' && input.multiple)
    {
      for (var i=0, len=this.selectedOptions.length; i<len; i++) {
        this.append(input.name, this.selectedOptions[i].value);
      }
    }
    else {
      this.append(input.name, input.value);
    }
  }, this);
}

Alpha.Serializer.prototype.append = function(key, value)
{
  if (value !== null) {
    this.data += (this.data ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value);
  }
}

Alpha.Serializer.prototype.toString = function() {
  return this.data;
}

