UI.Dialog = function() {}
UI.Dialog.prototype = new UI.Widget();

UI.Dialog.prototype.initDialog = function(options)
{
  this.setDefaultOptions({
    titlebar:      true,
    position:      ['center', 'middle'],
    onClose:       'destroy',
    closeOnEscape: true
  });
  this.initWidget(options);
  this.container.addClassName('dialog');
  
  if (this.options.titlebar)
  {
    // titlebar
    this.titlebar = document.createElement('div');
    this.titlebar.className = 'titlebar';
    this.container.insertBefore(this.titlebar, this.content);
    
    // title
    this.title = document.createElement('span');
    this.title.className = 'title';
    this.titlebar.appendChild(this.title);
    
    // close button
    this.closeButton = document.createElement('a');
    this.closeButton.className = 'close';
    this.closeButton.innerHTML = '<span>X</span>';
    this.closeButton.addEventListener('click', this.close.bind(this), false);
    this.titlebar.appendChild(this.closeButton);
  }
}

UI.Dialog.prototype.setTitle = function(title)
{
  if (title.tagName) {
    this.title.appendChild(title);
  }
  else {
    this.title.innerHTML = title;
  }
}

UI.Dialog.prototype.getTitle = function() {
  return this.title;
}

//UI.Dialog.prototype.attachToDOM = function()
//{
//  this.container.style.visibility = 'hidden';
//  UI.Widget.prototype.attachToDOM.call(this);
//}

/**
 * Positions the Dialog within the page. Position is defined by the +position+
 * option, which can be any of 'center', 'middle', 'left', 'right', 'top',
 * 'bottom', or a collection of it, like ['top', 'left'].
 * 
 * The default is ['center', 'middle'].
 */
UI.Dialog.prototype.setPosition = function()
{
  var position = {top: false, right: false, bottom: false, left: false};
  
  if (this.options.position.forEach)
  {
    this.options.position.forEach(function(pos) {
      position[pos] = true;
    });
  }
  else {
    position[this.options.position] = true;
  }
  
  var _display    = this.container.style.display;
  var _visibility = this.container.style.visibility;
  
  this.container.style.position   = 'absolute';
  this.container.style.display    = 'block';
  this.container.style.visibility = 'hidden';
  
  if (position.top) {
    this.container.style.top = '0px';
  }
  else if (position.bottom) {
    this.container.style.bottom = '0px';
  }
  else
  {
    var height = (window.innerHeight || document.documentElement.clientHeight) - this.container.offsetHeight;
    this.container.style.top = parseInt(Math.max(0, height) / 2
      + (document.documentElement ? document.documentElement.scrollTop : window.pageYOffset)) + 'px';
  }
  
  if (position.left) {
    this.container.style.left = '0px';
  }
  else if (position.right) {
    this.container.style.right = '0px';
  }
  else
  {
    var width = (window.innerWidth || document.documentElement.clientWidth) - this.container.offsetWidth;
    this.container.style.left = parseInt(Math.max(0, width) / 2
      + (document.documentElement ? document.documentElement.scrollLeft : window.pageXOffset)) + 'px';
  }
  
  this.container.style.display    = _display;
  this.container.style.visibility = _visibility;
}

UI.Dialog.prototype.destroy = function()
{
  delete this.title;
  delete this.titlebar;
  UI.Widget.prototype.destroy.call(this);
}

