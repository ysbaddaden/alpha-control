UI.Window = function () {};
UI.Window.prototype = new UI.Widget();

UI.createWindow = function () {
    var widget = new UI.Window();
    widget.initWindow.apply(widget, arguments);
    return widget;
};

UI.Window.prototype.initWindow = function (options) {
    this.setDefaultOptions({
        position: 'center middle',
        onClose:  'destroy',
        closeOnEscape: true,
        closeButton:   true
    });
    this.initWidget(options);
    this.container.classList.add('ui-window');

    this.titlebar = document.createElement('div');
    this.titlebar.className = 'ui-titlebar';
    this.container.before(this.titlebar, this.content);

    if (this.options.closeButton) {
        this.closeButton = document.createElement('span');
        this.closeButton.className = 'ui-close-button';
        this.closeButton.addEventListener('click', this.close.bind(this), false);
        this.titlebar.append(this.closeButton);
    }

    this.title = document.createElement('span');
    this.title.className = 'ui-title';
    this.titlebar.append(this.title);
};

// Sets the window title as text.
UI.Window.prototype.setTitle = function (title) {
    this.title.testContent = title;
};

// Positions the window. Automatically called on display.
UI.Window.prototype.position = function () {
    this.container.style.position = 'absolute';

    var position = {
        top:    false,
        right:  false,
        bottom: false,
        left:   false
    };
    if (typeof this.options.position == 'string') {
        this.options.position = this.options.position.split(/\s+/);
    }
    for (var i=0; i<this.options.position.length; i++) {
        position[this.options.position[i]] = true;
    }

    // vertical
    if (position.top) {
        this.container.style.top = '0px';
    } else if (position.bottom) {
        this.container.style.bottom = '0px';
    } else {
        var top = (window.innerHeight - this.container.offsetHeight) / 2 + window.pageYOffset;
        this.container.style.top = Math.round(top) + 'px';
    }

    // horizontal
    if (position.left) {
        this.container.style.left = '0px';
    } else if (position.right) {
        this.container.style.right = '0px';
    } else {
        var left = (window.innerWidth - this.container.offsetWidth) / 2 + window.pageXOffset;
        this.container.style.left = Math.round(left) + 'px';
    }
};

UI.Window.prototype._destroy = function () {
    UI.Widget.prototype._destroy.call(this);
    delete this.closeButton;
    delete this.title;
    delete this.titlebar;
};

