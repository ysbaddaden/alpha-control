// TODO: Implement an 'auto' position for UI.Picker

UI.Picker = function () {};
UI.Picker.prototype = new UI.Widget();

Eventable(UI.Picker, ['activate', 'deactivate']);

UI.createPicker = function () {
    var widget = new UI.Picker();
    widget.initPicker.apply(widget, arguments);
    return widget;
};

UI.Picker.prototype.initPicker = function (relativeElement, options) {
    this.setDefaultOptions({
        position: '',
        onClose: 'hide',
        closeOnEscape: true,
        closeOnOuterClick: true,
        activate:   [],
        deactivate: []
    });
    this.initWidget(options);
    this.container.classList.add('ui-picker');

    if (typeof relativeElement === 'undefined') {
        throw new TypeError('Missing required parameter: relativeElement.');
    }
    this.relativeElement = relativeElement;

    var activate = this.activate.bind(this);
    for (var i = 0; i < this.options.activate.length; i++) {
        this.relativeElement.addEventListener(this.options.activate[i], activate, false);
    }

    var deactivate = this.deactivate.bind(this);
    for (var j = 0; j < this.options.deactivate.length; j++) {
        this.relativeElement.addEventListener(this.options.deactivate[j], deactivate, false);
    }
};

UI.Picker.prototype.activate = function () {
    if (!this.dispatchEvent('activate')) {
        this.display();
    }
};

UI.Picker.prototype.deactivate = function () {
    if (!this.dispatchEvent('deactivate')) {
        this.close();
    }
};

UI.Picker.prototype.realize = function () {
    UI.Widget.prototype.realize.call(this);
    this.relativeElement.parentNode.append(this.container);
};

// Positions the Picker around the relativeElement.
// Called automatically on display.
UI.Picker.prototype.position = function () {
    this.container.style.position = 'absolute';

    var top  = this.relativeElement.offsetTop;
    var left = this.relativeElement.offsetLeft;

    var position = {
        top:    false,
        right:  false,
        bottom: false,
        left:   false
    };
    if (typeof this.options.position == 'string') {
        this.options.position = this.options.position.split(/\s+/);
    }
    for (var i = 0; i < this.options.position.length; i++) {
        position[this.options.position[i]] = true;
    }

    if (position.length > 0) {
        // vertical
        if (position.top) {
            top -= this.container.offsetHeight;
        } else if (position.bottom) {
            top += this.relativeElement.offsetHeight;
        } else {
            top += this.relativeElement.offsetHeight / 2;
            top -= this.container.offsetHeight / 2;
        }

        // horizontal
        if (position.left) {
            left -= this.container.offsetWidth;
        } else if (position.right) {
            left += this.relativeElement.offsetWidth;
        } else {
            left += this.relativeElement.offsetWidth / 2;
            left -= this.container.offsetWidth / 2;
        }

        // style
        var className = [];

        if (position.top) {
            className.push('top');
        } else if (position.bottom) {
            className.push('bottom');
        }
        if (position.left) {
            className.push('left');
        } else if (position.right) {
            className.push('right');
        }
        this.container.classList.add(className.join('-'));
    }
    else {
        top += this.relativeElement.offsetHeight;
        this.container.style.minWidth = this.relativeElement.offsetWidth + 'px';
    }

    this.container.style.top  = Math.round(top)  + 'px';
    this.container.style.left = Math.round(left) + 'px';
};

