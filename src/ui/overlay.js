UI.Overlay = function() {};
UI.Overlay.prototype = new UI.Widget();

UI.createOverlay = function() {
    var overlay = new UI.Overlay();
    overlay.initOverlay.apply(overlay, arguments);
    return overlay;
};

UI.Overlay.prototype.initOverlay = function(options) {
    this.setDefaultOptions({
        onClose: 'destroy'
    });
    this.initWidget(options);
    this.content.classList.remove('ui-content');
    this.content.classList.add('ui-overlay');

    //if (!!(window.VBArray && document.implementation)) {
    //    // we need to trick IE6 with an iframe, otherwise it places SELECT element _over_ the overlay.
    //    var iframe = document.createElement('iframe');
    //    iframe.src = "javascript:'<html></html>';";
    //    iframe.style.cssText += ';position:absolute;border:0;' +
    //        'top:0;left:0;width:100%;height:100%;overflow:hidden;filter:alpha(opacity=0);';
    //    this.container.before(iframe, this.content);
    //    this.content.style.cssText += ';position:absolute;border:0;top:0;left:0;width:100%;height:100%;';
    //}
};
