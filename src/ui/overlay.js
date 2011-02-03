UI.Overlay = function() {}
UI.Overlay.prototype = new UI.Widget();

UI.Overlay.prototype.initOverlay = function(options)
{
  this.setOptions({
    onClose: 'destroy',
    closeOnEscape: false
  });
  this.initWidget(options);
  this.content.className = 'overlay';

  if (!!(window.VBArray && document.implementation))
  {
    // we need to trick IE6 with an iframe, otherwise it places SELECT element _over_ the overlay.
    var iframe = document.createElement('iframe');
    iframe.src = "javascript:'<html></html>';";
    iframe.style.cssText += ';position:absolute;border:0;' +
      'top:0;left:0;width:100%;height:100%;overflow:hidden;filter:alpha(opacity=0);';
    this.container.insertBefore(iframe, this.content);
    
    this.content.style.cssText += ';position:absolute;border:0;top:0;left:0;width:100%;height:100%;';
  }
}

UI.Overlay.prototype.setPosition = function()
{
  var innerWidth, innerHeight, width, height;
  innerWidth  = (window.innerWidth  || document.documentElement.clientWidth);
  innerHeight = (window.innerHeight || document.documentElement.clientHeight);
  width  = ((document.body.clientWidth  > innerWidth)  ? document.body.clientWidth  : innerWidth);
  height = ((document.body.clientHeight > innerHeight) ? document.body.clientHeight : innerHeight);
  
  this.content.width    = width  + 'px';
  this.content.height   = height + 'px';
  this.content.position = 'absolute';
}
