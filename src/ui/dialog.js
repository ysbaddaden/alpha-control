UI.Dialog = function () {};
UI.Dialog.prototype = new UI.Window();

Eventable(UI.Dialog, ['validate', 'cancel']);

UI.createDialog = function () {
    var dialog = new UI.Dialog();
    dialog.initDialog.apply(dialog, arguments);
    return dialog;
};

UI.Dialog.prototype.initDialog = function (options) {
    this.setDefaultOptions({
        modal: true
    });
    this.initWindow(options);
    this.container.classList.add('ui-dialog');

    this.buttons = document.createElement('div');
    this.buttons.className = 'ui-buttons';
    this.container.append(this.buttons);

    if (this.options.modal) {
        var overlay = UI.createOverlay();
        this.addEventListener('display', overlay.display.bind(overlay));
        this.addEventListener('hide',    overlay.hide.bind(overlay));
        this.addEventListener('destroy', overlay.destroy.bind(overlay));
    }
};

// Adds a button to the button container. Buttons are placed from the right
// (most important) to the left (less important).
UI.Dialog.prototype.addButton = function (label, callback) {
    var button = document.createElement('button');
    button.testContent = label;
    button.onclick = callback;
    this.buttons.before(button, this.buttons.firstChild);
    return button;
};

