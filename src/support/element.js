Element.prototype.findParentNode = function (nodeName) {
  var elm = this;
  nodeName = nodeName.toUpperCase();
  while (elm && elm.nodeName !== nodeName && elm.parentNode) {
    elm = elm.get ? elm.get('parentNode') : elm.parentNode;
  }
  return elm.nodeName === nodeName ? elm : null;
};

Element.prototype.insertAfter = function (newElement, referenceElement) {
  if (!referenceElement) {
    this.appendChild(newElement);
  } else {
    this.insertBefore(newElement, referenceElement.nextSibling);
  }
  return newElement;
};

Element.prototype.getPosition = function (parent) {
  var pos = {
    left: 0,
    top:  0
  };
  if (this.offsetParent) {
    var obj = this;
    do {
      pos.left += obj.offsetLeft;
      pos.top  += obj.offsetTop;
    } while ((obj = obj.offsetParent));
  }
  return pos;
};

//// DEPRECATED: elm.hasClassName() -> elm.classList.contains()
//if (!Element.prototype.hasClassName) {
//  Element.prototype.hasClassName = function (className) {
//    console && console.warn("DEPRECATION WARNING: elm.hasClassName() is deprecated, use elm.classList.contains() instead.");
//    return this.classList.contains(className);
//  }
//};

//// DEPRECATED: elm.addClassName() -> elm.classList.add()
//if (!Element.prototype.addClassName) {
//  Element.prototype.addClassName = function (className) {
//    console && console.warn("DEPRECATION WARNING: elm.addClassName() is deprecated, use elm.classList.add() instead.");
//    if (!this.classList.contains(className)) {
//      this.classList.add(className);
//    }
//  }
//};

//// DEPRECATED: elm.removeClassName() -> elm.classList.remove()
//if (!Element.prototype.removeClassName) {
//  Element.prototype.removeClassName = function (className)
//  {
//    console && console.warn("DEPRECATION WARNING: elm.removeClassName() is deprecated, use elm.classList.remove() instead.");
//    this.classList.remove(className);
//  }
//}

//// DEPRECATED: elm.toggleClassName() -> elm.classList.toggle()
//if (!Element.prototype.toggleClassName) {
//  Element.prototype.toggleClassName = function (className) {
//    console && console.warn("DEPRECATION WARNING: elm.toggleClassName() is deprecated, use elm.classList.toggle() instead.");
//    var meth = this.classList.contains(className) ? 'remove' : 'add';
//    this.classList[meth](className);
//  }
//}

Element.prototype.setStyle = function (property, value) {
  if (typeof property === 'object') {
    for (var p in property) {
      this.setStyle(p, property[p]);
    }
  } else {
    if (property === 'opacity') {
      this.style.cssText += ';-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + (value * 100) + ')";' +
        'filter:alpha(opacity=' + Math.round(value * 100) + ');zoom:1;opacity:' + value;
    } else {
      this.style.cssText += ';' + property.hyphenize() + ':' + value;
    }
  }
};

Element.prototype.getStyle = function (property) {
  var v;
  if (window.getComputedStyle) {
    v = document.defaultView.getComputedStyle(this, null).getPropertyValue(property);
  } else if (this.currentStyle) {
    if (property === 'opacity') {
      var alpha = this.filters["DXImageTransform.Microsoft.Alpha"] || this.filters.alpha || {};
      return (alpha.opacity || 100) / 100.0;
    }
    v = this.currentStyle[property.camelize('lower')];
  }
  if (Color && Color.isColor(v)) {
    v = new Alpha.Color(v);
  }
  return v;
};

