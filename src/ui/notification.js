// FIXME: notification may not work as expected on IE6 (since position:fixed isn't available)
// Check http://leaverou.me/2009/02/bulletproof-cross-browser-rgba-backgrounds/

UI.Notification = function() {}
UI.Notification.prototype = new UI.Widget();

UI.createNotification = function () {
  var notification = new UI.Notification();
  notification.initNotification.call(notification, arguments);
  return notification;
}

UI.Notification.prototype.initNotification = function(options) {
  this.setDefaultOptions({
    onClose: 'hide',
    timeout: 2500
  });
  this.initWidget(options);
  this.container.classList.add('ui-notification');
  this.content.classList.remove('ui-content');
}

UI.Notification.prototype.setMessage = function(html, timeout) {
  timeout = timeout || this.options.timeout;
  
  if (this.timer) {
    clearTimeout(this.timer);
  }
  
  this.setContent(html);
  this.display();
  
  if (timeout > 0) {
    this.timer = setTimeout(this.close.bind(this), timeout);
  }
}

UI.Notification.prototype.getMessage = function() {
  return this.getContent().innerHTML;
}

