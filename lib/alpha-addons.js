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
 * Linearizes a color, whatever it's input format (hex or RGB).
 * 
 * new Alpha.Color('#FFF');
 * new Alpha.Color('#0000FA');
 * new Alpha.Color('rgb(128, 78, 34)');
 * new Alpha.Color('rgba(128, 78, 34, 0.5)');
 * new Alpha.Color([0, 0, 0])
 * new Alpha.Color([0, 0, 0, 1.0])
 * new Alpha.Color({r: 0, g: 0, b: 0})
 * new Alpha.Color({r: 0, g: 0, b: 0, a: 1.0})
 * 
 * new Alpha.Color('#FFF').toHex()      // '#FFFFFF'
 * new Alpha.Color('#FFF').toRGB()      // 'rgba(255, 255, 255)'
 * new Alpha.Color('#FFF').toRGBA()     // 'rgba(255, 255, 255, 1.0)'
 * new Alpha.Color('#FFF').toRGBA(0.75) // 'rgba(255, 255, 255, 0.75)'
 * new Alpha.Color([r: 0, g: 0, b: 0, a: 1.0]).toRGBA() // 'rgba(0, 0, 0, 1.0)'
 * 
 * TODO: Accept HSV input colors like hsv(0, 0, 0), hsva(0, 0, 0, 1.0), {h:0, s:0, v:0} and {h:0, s:0, v:0, a:1.0}.
 * TODO: toHSV() and toHSVA().
 */
Alpha.Color = function(color)
{
  if (color instanceof Alpha.Color) {
    return color;
  }
  else if (typeof color == 'string')
  {
    color = color.trim();
    if (color.indexOf('#') > -1)
    {
      if (color.length == '4')
      {
        // #FFF
        this.r = parseInt(color[1] + color[1], 16);
        this.g = parseInt(color[2] + color[2], 16);
        this.b = parseInt(color[3] + color[3], 16);
      }
      else if (color.length == '7')
      {
        // #0000FA
        this.r = parseInt(color.substr(1, 2), 16);
        this.g = parseInt(color.substr(3, 2), 16);
        this.b = parseInt(color.substr(5, 2), 16);
      }
    }
    else 
    {
      var parts = color.match(/rgb[a]?\(([\d\s]+),([\d\s]+),([\d\s]+)(?:,([\d\s\.]+))?\)/i);
      if (parts)
      {
        // rgb(0, 0, 0) or rgba(0, 0, 0, .5)
        this.r = parseInt(parts[1].trim(), 10);
        this.g = parseInt(parts[2].trim(), 10);
        this.b = parseInt(parts[3].trim(), 10);
        this.a = parts[4] ? parseFloat(parts[4].trim(), 10) : null;
      }
      else {
        throw new Error("Not a color: " + color);
      }
    }
  }
  else if (typeof (color) == 'object' && color.r && color.g && color.b)
  {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
    this.a = color.a;
  }
  else if (color instanceof Array && color.length >= 3)
  {
    this.r = color[0];
    this.g = color[1];
    this.b = color[2];
    this.a = color[3];
  }
  else {
    throw new Error("Not a color: " + color);
  }

  // RGB to HSV (HSB)
	var max   = Math.max(this.r, this.g, this.b);
	var min   = Math.min(this.r, this.g, this.b);
	var delta = (max - min);
	
	this.v = max;
	this.s = (max != 0) ? 255 * delta / max : 0;
	if (this.s != 0)
	{
		if (max == this.r) {
			this.h = (this.g - this.b) / delta;
		}
		else if (max == this.g) {
			this.h = 2.0 + (this.b - this.r) / delta;
		}
		else if (max == this.b) {
			this.h = 4.0 + (this.r - this.g) / delta;
		}
	}
	else {
		this.h = 0;
	}
	this.h *= 60;
	if (this.h < 0) {
		this.h += 360;
	}
	this.h = Math.round(this.h);
	this.s = Math.round(this.s * 100 / 255);
	this.v = Math.round(this.v * 100 / 255);
}

Alpha.Color.prototype.a = 1.0;

Alpha.Color.prototype.r = 1.0;
Alpha.Color.prototype.g = 1.0;
Alpha.Color.prototype.b = 1.0;

Alpha.Color.prototype.h = 1.0;
Alpha.Color.prototype.s = 1.0;
Alpha.Color.prototype.v = 1.0;

Alpha.Color.prototype.toRGB = function() {
  return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
}

Alpha.Color.prototype.toRGBA = function(a) {
  return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + (a || this.a) + ')';
}

Alpha.Color.prototype.toHex = function()
{
  var r = this.r.toString(16).toUpperCase();
  var g = this.g.toString(16).toUpperCase();
  var b = this.b.toString(16).toUpperCase();
  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  return '#' + r + g + b;
}

Alpha.Color.prototype.toString = function() {
  return this.toHex();
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

