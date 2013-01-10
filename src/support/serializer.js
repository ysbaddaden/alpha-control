// Serializes an HTML form into an application/x-www-form-urlencoded string.
//
// Example:
//
//   var form = document.getElementById('update_product_1');
//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', form.action);
//
//   var params = new Serializer(form);
//   params.append('_method', 'put');
//   xhr.send(params.toString());
//
// Alternatively you may:
//
//   var form = document.getElementById('update_product_1');
//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', form.action);
//   xhr.send(form.serialize());

var Serializer = function(form) {
    this.form = form;
    this.data = [];

    var inputs = form.querySelectorAll('input,select,textarea');
    Array.prototype.forEach.call(inputs, function (input) {
        if (!input.name || input.disabled || input.type === 'file' ||
            (input.type === 'checkbox' && !input.checked) ||
            (input.type === 'submit' && !input.hasAttribute('submitted')))
        {
            return;
        }
        if (input.type === 'select' && input.multiple) {
            for (var i = 0, len = this.selectedOptions.length; i < len; i++) {
                this.append(input.name, this.selectedOptions[i].value);
            }
        } else {
            this.append(input.name, input.value);
        }
    }, this);
};

Serializer.prototype.append = function (key, value) {
    if (value !== null) {
        this.data.push([ key, value ]);
    }
};

Serializer.prototype.toString = function () {
    var str = [];
    for (var i = 0, l = this.data.length; i < l; i++) {
        str.push(encodeURIComponent(this.data[i][0]) + '=' + encodeURIComponent(this.data[i][1]));
    }
    return str.join('&');
};

HTMLFormElement.prototype.serialize = function () {
    return new Serializer(this).toString();
};

//HTMLFormElement.prototype.send = function () {
//    var xhr = new XMLHttpRequest();
//    xhr.open(this.method.toUpperCase(), this.action);
//    xhr.send(this.serialize());
//    return xhr;
//};
