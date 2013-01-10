var UI = {};

UI.Widget = function () {};

Optionable(UI.Widget);
Eventable(UI.Widget, ['realize', 'unrealize', 'display', 'close', 'hide', 'destroy']);

// Initializes the widget.
UI.Widget.prototype.initWidget = function (options) {
    this.setDefaultOptions({
        onClose: 'destroy',
        closeOnEscape: false,
        closeOnOuterClick: false
    });
    this.setOptions(options);

    this.container = document.createElement('div');
    this.container.className = 'ui-widget';

    this.content = document.createElement('div');
    this.content.className = 'ui-content';
    this.container.append(this.content);

    if (this.options.id) {
        this.setId(this.options.id);
    }
    if (this.options.closeOnEscape) {
        this.setCloseOnEscape();
    }
    if (this.options.closeOnOuterClick) {
        this.setCloseOnOuterClick();
    }
};

// Sets the id property of the Widget's container.
UI.Widget.prototype.setId = function (id) {
    return this.container.id = this.id = id;
};

// Returns the widget content Element.
UI.Widget.prototype.getContent = function () {
    return this.content;
};

// Sets the widget content either as a HTML String or an Element to append.
UI.Widget.prototype.setContent = function (content) {
    if (typeof content === 'string') {
        this.content.innerHTML = content;
    } else {
        this.content.append(content);
    }
};

// Returns true if the widget has been attached to the DOM, false otherwise.
UI.Widget.prototype.realized = function () {
    return !!this.container.parentNode;
};

// Attaches the widget to the DOM, but doesn't display it.
UI.Widget.prototype.realize = function () {
    this.dispatchEvent('realize');
    this.container.style.display    = 'block';
    this.container.style.visibility = 'hidden';
    document.body.append(this.container);
};

// Removes the widget from the DOM.
UI.Widget.prototype.unrealize = function () {
    this.dispatchEvent('unrealize');
    this.container.style.display    = 'none';
    this.container.style.visibility = 'hidden';
    if (this.container.parentNode) {
        this.container.remove();
    }
};

// Displays the widget.
UI.Widget.prototype.display = function () {
    if (!this.dispatchEvent('display')) {
        this._display();
    }
};

// Checks wether the widget is displayed or not.
UI.Widget.prototype.displayed = function () {
    return this.container.style.display === 'block' &&
    this.container.style.visibility === 'visible';
};

// Closes the widget by either hiding or destroying it, depending on the
// onClose option (which defaults to 'destroy'):
UI.Widget.prototype.close = function () {
    if (!this.dispatchEvent('close')) {
        switch (this.options.onClose) {
        case 'hide':
            this.hide();
            break;
        case 'destroy':
            this.destroy();
            break;
        default:
            throw new Error("Unknown onClose option: " + this.options.onClose + ".");
        }
    }
};

// Hides the widget.
UI.Widget.prototype.hide = function () {
    if (!this.dispatchEvent('hide')) {
        this._hide();
    }
};

// Permanently destroys the widget.
UI.Widget.prototype.destroy = function () {
    if (!this.dispatchEvent('destroy')) {
        this._destroy();
    }
};

// Positions the widget. Actually does nothing by itself, but children like
// UI.Window and UI.Picker do need it.
UI.Widget.prototype.position = function () {
};

// Actually displays the widget, without dispatching the 'display' event.
UI.Widget.prototype._display = function () {
    this.realize();
    this.position();
    this.container.style.display    = 'block';
    this.container.style.visibility = 'visible';
};

// Actually hides the widget, without dispatching the 'hide' event.
UI.Widget.prototype._hide = function () {
    this.container.style.display    = 'none';
    this.container.style.visibility = 'hidden';
};

// Actually destroys the widget, without dispatching the 'destroy' event.
UI.Widget.prototype._destroy = function () {
    if (this.container) {
        this.unrealize();
        this._hide();
        delete this.content;
        delete this.container;
        this.id = null;
    }
};

UI.Widget.prototype.setCloseOnEscape = function () {
    var self = this;
    var closeOnEscape = function (event) {
        if (event.keyCode === 27) {  // Esc
            self.close();
        }
    };
    this.addEventListener('realize', function() {
        window.addEventListener('keyup', closeOnEscape, false);
    });
    this.addEventListener('unrealize', function() {
        window.removeEventListener('keyup', closeOnEscape, false);
    });
};

UI.Widget.prototype.setCloseOnOuterClick = function () {
    var self = this;
    var closeOnOuterClick = function (event) {
        var obj = event.target;
        do {
            if (obj === self.container || obj === self.relativeElement) {
                return;
            }
        } while ((obj = obj.parentNode));
        self.close();
    };
    this.addEventListener('realize', function () {
        window.addEventListener('click', closeOnOuterClick, false);
    });
    this.addEventListener('unrealize', function () {
        window.removeEventListener('click', closeOnOuterClick, false);
    });
};

