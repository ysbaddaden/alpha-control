UI.ModalDialog = function() {}
UI.ModalDialog.prototype = new UI.Dialog();

UI.ModalDialog.prototype.initModalDialog = function(options)
{
  this.initDialog(options);
  this.container.addClassName('modal');
  
  this.overlay = new UI.Overlay();
  this.overlay.initOverlay();
}

UI.ModalDialog.prototype.attachToDOM = function()
{
  this.overlay.attachToDOM();
  UI.Dialog.prototype.attachToDOM.call(this);
}

UI.ModalDialog.prototype.show = function()
{
  this.overlay.show();
  UI.Dialog.prototype.show.call(this);
}

UI.ModalDialog.prototype._close = function(type)
{
  UI.Dialog.prototype._close.call(this, type);
  
  if (type == 'hide') {
    this.overlay.hide();
  }
  else {
    this.overlay.destroy();
  }
}

