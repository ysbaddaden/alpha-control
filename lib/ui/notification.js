// FIXME: notification may not work as expected on IE6 (since position:fixed isn't available)
// Check http://leaverou.me/2009/02/bulletproof-cross-browser-rgba-backgrounds/

UI.Notification = function() {}
UI.Notification.prototype = new UI.Widget();

UI.Notification.prototype.initNotification = function()
{
  this.setOptions({timeout: 1000});
  this.initWidget(options);
  this.container.addClassName('notification');
}

UI.Notification.prototype.setMessage = function(text, timeout)
{
  timeout = timeout || this.options.timeout;
  
  this.setContent(text);
  this.show();
  
  if (timeout > 0) {
    setTimeout(this.hide.bind(this), timeout);
  }
}

