Element.prototype.findParent = function (nodeName) {
    if (nodeName) {
        var elm = this;
        nodeName = nodeName.toUpperCase();
        while (elm) {
            if (elm.nodeName === nodeName) {
                return elm;
            }
            elm = elm.parentNode;
        }
        return null;
    }
    return this.parentNode;
};

Element.prototype.getPosition = function () {
    var pos = {
        left: 0,
        top:  0
    };
    if (this.offsetParent) {
        var obj = this;
        do {
            pos.left += obj.offsetLeft;
            pos.top  += obj.offsetTop;
            obj = obj.offsetParent;
        } while (obj);
    }
    return pos;
};

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
            var alpha = this.filters['DXImageTransform.Microsoft.Alpha'] || this.filters.alpha || {};
            return (alpha.opacity || 100) / 100.0;
        }
        v = this.currentStyle[property.camelize('lower')];
    }
    if (window.Color && Color.isColor(v)) {
        v = new Color(v);
    }
    return v;
};
