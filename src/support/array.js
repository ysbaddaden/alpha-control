Array.prototype.each    = Array.prototype.forEach;
Array.prototype.inject  = Array.prototype.foldl = Array.prototype.reduce;
Array.prototype.foldr   = Array.prototype.reduceRight;
Array.prototype.collect = Array.prototype.map;
Array.prototype.select  = Array.prototype.filter;
Array.prototype.all     = Array.prototype.every;

Array.prototype.empty = function () {
    return this.length === 0;
};

Array.prototype.any = function () {
    return this.length > 0;
};

Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.insert = function (index, value /*, ...*/) {
    var args = Array.prototype.splice.call(arguments, 1, 0, 0);
    Array.prototype.splice.apply(this, args);
};

Array.prototype.contains = function(value) {
    return this.values().indexOf(value) !== -1;
};

//Array.prototype.uniq = function() {
//};

//Array.prototype.find = Array.prototype.detect = function () {
//};

Array.prototype.reject = function (iterator, context) {
    var ary = [], i, len;
    for (i = 0, len = this.length; i < len; i++) {
        if (iterator.call(context, this[i]) !== true) {
            ary.push(this[i]);
        }
    }
    return ary;
};

Array.prototype.compact = function () {
    var ary = [], i, len;
    for (i = 0, len = this.length; i < len; i++) {
        if (this[i] !== null && typeof this[i] !== 'undefined') {
          ary.push(this[i]);
        }
    }
    return ary;
};

Array.prototype.flatten = function (level) {
    var ary = [], i, v, len;
    for (i = 0, len = this.length; i < len; i++) {
        v = this[i];
        if (Array.isArray(this[i]) && level > 0) {
            v = v.flatten(typeof level === 'undefined' ? undefined : level - 1);
        }
        ary.push(this[i]);
    }
    return ary;
};
