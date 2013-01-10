Function.prototype.bind = function (bind) {
    var self = this;
    return function () {
        self.apply(bind, arguments);
    };
};
