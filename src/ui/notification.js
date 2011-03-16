// FIXME: notification may not work as expected on IE6 (since position:fixed isn't available)
// Check http://leaverou.me/2009/02/bulletproof-cross-browser-rgba-backgrounds/

UI.Notification = function() {}
UI.Notification.prototype = new UI.Widget();

UI.Notification.prototype.initNotification = function(options)
{
  this.setOptions({timeout: 2500});
  this.initWidget(options);
  this.container.addClassName('notification');
}

UI.Notification.prototype.setMessage = function(html, timeout)
{
  timeout = timeout || this.options.timeout;
  
  if (this.timer) {
    clearTimeout(this.timer);
  }
  
  this.setContent(html);
  this.show();
  
  if (timeout > 0) {
    this.timer = setTimeout(this.hide.bind(this), timeout);
  }
}

UI.Notification.prototype.getMessage = function() {
  return this.getContent().innerHTML;
}

