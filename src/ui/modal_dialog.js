/*
UI.ModalDialog = function() {}
UI.ModalDialog.prototype = new UI.Dialog();

UI.ModalDialog.prototype.initModalDialog = function(options)
{
  this.initDialog(options);
  this.container.classList.add('modal');
  
  this.overlay = new UI.Overlay();
  this.overlay.initOverlay();
  
  this.addEventListener('show',    this.overlay.show.bind(this.overlay));
  this.addEventListener('hide',    this.overlay.hide.bind(this.overlay));
  this.addEventListener('destroy', this.overlay.destroy.bind(this.overlay));
}

UI.ModalDialog.prototype.attachToDOM = function()
{
  this.overlay.attachToDOM();
  UI.Dialog.prototype.attachToDOM.call(this);
}
*/
