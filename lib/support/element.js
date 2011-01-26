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

