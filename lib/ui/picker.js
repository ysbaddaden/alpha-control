// TODO: Implement an 'auto' position for UI.Picker

UI.Picker = function() {}
UI.Picker.prototype = new UI.Picker();

UI.Picker.prototype.options = {
  position:          null,
  onClose:           'hide',
  closeOnEscape:     true,
  closeOnOuterClick: true
}

UI.Picker.prototype.initPicker = function(relativeElement, options)
{
  if (typeof relativeElement == 'undefined') {
    throw new Error('Missing required parameter: relativeElement.');
  }
  this.relativeElement = relativeElement;
  
  this.initWidget(options);
  this.container.addClassname('picker');
  
  if (this.options.closeOnOuterClick)
  {
    this._bound_closeOnOuterClick = this._closeOnOuterClick.bind(this);
    
//    var elm = document.documentElement ? document.documentElement : window;
//    elm.addEventListener('click', this._bound_closeOnOuterClick, false)
    window.addEventListener('click', this._bound_closeOnOuterClick, false);
  }
}

UI.Picker.prototype._closeOnOuterClick = function(event)
{
  var obj = event.target;
  do
  {
    if (obj == this.container || obj == this.relativeElement) {
      return;
    }
  }
  while(obj = obj.parentNode);
  
  this.close();
}

UI.Picker.prototype.attachToDOM = function() {
  this.relativeElement.parentNode.appendChild(this.container);
}

UI.Picker.prototype.initialPosition = function(absolute)
{
  return {
    left: this.relativeElement.offsetLeft,
    top:  this.relativeElement.offsetTop
  };
}

UI.Picker.prototype.computePosition = function()
{
  var position = this.initialPosition();
  
  if (this.options.position && this.options.position.indexOf)
  {
    // vertical position
    if (this.options.position.indexOf('top') > -1) {
      position.top -= this.container.offsetHeight;
    }
    else if (this.options.position.indexOf('bottom') > -1) {
      position.top += this.relativeElement.offsetHeight;
    }
    else
    {
      position.top += this.relativeElement.offsetHeight / 2;
      position.top -= this.container.offsetHeight / 2;
    }
    
    // horizontal position
    if (this.options.position.indexOf('left') > -1) {
      position.left -= this.container.offsetWidth;
    }
    else if (this.options.position.indexOf('right') > -1) {
      position.left += this.relativeElement.offsetWidth;
    }
    else
    {
      position.left += this.relativeElement.offsetWidth / 2;
      position.left -= this.container.offsetWidth / 2;
    }
    
    // normalizes the position
    var className = [];
    if (this.options.position.indexOf('top') > -1) {
      className.push('top');
    }
    else if (this.options.position.indexOf('bottom') > -1) {
      className.push('bottom');
    }
    if (this.options.position.indexOf('left') > -1) {
      className.push('left');
    }
    else if (this.options.position.indexOf('right') > -1) {
      className.push('right');
    }
    position.className = className.join('-');
  }
  else {
    position.top += this.relativeElement.offsetHeight;
  }
  
  return position;
}

UI.Picker.prototype.setPosition = function()
{
  this.container.style.position = 'absolute';
  var position = this.computePosition();
  
  this.container.style.top  = parseInt(position.top)  + 'px';
  this.container.style.left = parseInt(position.left) + 'px';
  
  if (!position.className) {
    this.container.style.minWidth = this.relativeElement.offsetWidth + 'px';
  }
  else {
    this.container.addClassName(position.className);
  }
}

UI.Picker.prototype.destroy = function()
{
  window.removeEventListener('click', this._bound_closeOnOuterClick, false);
  UI.Widget.prototype.destroy.call(this);
}

