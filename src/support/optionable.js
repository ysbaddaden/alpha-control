var Optionable = function (klass) {
    klass.prototype.initOptions = function () {
        if (!this.options) {
            this.options = {};
        }
    };

    klass.prototype.setOptions = function (options) {
        this.initOptions();
        if (!options) {
            return;
        }
        for (var k in options) {
            if (options.hasOwnProperty(k)) {
                this.options[k] = options[k];
            }
        }
    };

    klass.prototype.setDefaultOptions = function (options) {
        this.initOptions();
        if (!options) {
            return;
        }
        for (var k in options) {
            // only define if null or undefined
            if (options.hasOwnProperty(k) && this.options[k] == null) {
                this.options[k] = options[k];
            }
        }
    };
};

