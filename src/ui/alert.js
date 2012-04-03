UI.Alert = function () {};
UI.Alert.prototype = new UI.Dialog();

UI.Alert.Styles = {
  Warning:       'warning',
  Informational: 'informational',
  Critical:      'critical'
};

UI.createAlert = function () {
  var alert = new UI.Alert();
  alert.initAlert.apply(alert, arguments);
  return alert;
};

UI.createWarningAlert = function () {
  var alert = new UI.Alert();
  alert.initAlert.apply(alert, arguments);
  alert.setAlertStyle(UI.Alert.Styles.Warning);
  alert.addButton("OK",     alert.validate.bind(alert));
  alert.addButton("Cancel", alert.cancel.bind(alert));
  return alert;
};

UI.createInformationalAlert = function () {
  var alert = new UI.Alert();
  alert.initAlert.apply(alert, arguments);
  alert.setAlertStyle(UI.Alert.Styles.Informational);
  alert.addButton("OK", alert.validate.bind(alert));
  return alert;
};

UI.createCriticalAlert = function () {
  var alert = new UI.Alert();
  alert.initAlert.apply(alert, arguments);
  alert.setAlertStyle(UI.Alert.Styles.Critical);
  alert.addButton("OK",     alert.validate.bind(alert));
  alert.addButton("Cancel", alert.cancel.bind(alert));
  return alert;
};

UI.Alert.prototype.initAlert = function (options) {
  this.setDefaultOptions({
    closeButton: false
  });
  this.initDialog(options);
  this.container.classList.add('ui-alert');
  
  this.messageText = document.createElement('p');
  this.messageText.className = 'ui-message-text';
  this.content.appendChild(this.messageText);
  
  this.informativeText = document.createElement('p');
  this.informativeText.className = 'ui-informative-text';
  this.content.appendChild(this.informativeText);
};

// Sets the alert style (optional). It actually just sets an 'ui-style' class name.
UI.Alert.prototype.setAlertStyle = function (alertStyle) {
  for (var k in UI.Dialog.Styles) {
    this.container.classList.remove('ui-' + UI.Dialog.Styles[k]);
  }
  this.alertStyle = alertStyle;
  this.container.classList.add('ui-' + this.alertStyle);
};

// Sets the message text, which is emphasized.
UI.Alert.prototype.setMessageText = function (text) {
  this.messageText.innerText = text;
};

// Sets the message text which should explain the alert message.
UI.Alert.prototype.setInformativeText = function (text) {
  this.informativeText.innerText = text;
};

// Callback for the OK button. Dispatches the 'validate' event and eventually
// closes the dialog.
UI.Alert.prototype.validate = function () {
  if (!this.dispatchEvent('validate')) {
    this.close();
  }
};

// Callback for the cancel button. Dispatches the 'cancel' event and eventually
// closes the dialog.
UI.Alert.prototype.cancel = function () {
  if (!this.dispatchEvent('cancel')) {
    this.close();
  }
};

