Object.dup = function (obj) {
    var dup = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            dup[key] = obj[key];
        }
    }
    return dup;
};

Object.extend = function (obj) {
    var dup = Object.dup(obj);
    for (var i = 1, l = arguments.length; i < l; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                dup[key] = arguments[i][key];
            }
        }
    }
    return dup;
};
