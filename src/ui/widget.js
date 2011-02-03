// TODO: Add events to UI.Widget

var UI = {};

UI.Widget = function() {}

Optionable(UI.Widget);
//Eventable(UI.Widget, ['show', 'close', 'hide', 'destroy']);

/**
 * Initializes a Widget.
 * 
 * Options:
 * 
 * - +id+            - widget's Element ID
 * - +className+     - widget's Element className
 * - +onClose+       - the strategy to adopt on close: either +'hide'+ or +'destroy'+.
 * - +closeOnEscape+ - boolean, defaults to false
 */
UI.Widget.prototype.initWidget = function(options)
{
  this.setOptions(options);
  
  this.container = document.createElement('div');
  if (this.options.id) this.container.id = this.options.id;
  if (this.options.className) this.container.className = this.options.className;
  
  this.content = document.createElement('div');
  this.content.className = 'content';
  this.container.appendChild(this.content);
  
  if (this.options.closeOnEscape)
  {
    this._closeOnEscape = this.close.bind(this);
    window.addEventListener('keyup', this._closeOnEscape, false);
  }
  
  this._hide();
}

/**
 * Sets Widget's content. Accepts either a String or a DOM Element.
 */
UI.Widget.prototype.setContent = function(content)
{
  if (content.tagName)
  {
    this.content.innerHTML = '';
    this.content.appendChild(content);
  }
  else {
    this.content.innerHTML = content;
  }
}

/**
 * Returns the DOM Element of the Widget's content.
 */
UI.Widget.prototype.getContent = function(content) {
  return this.content;
}

/**
 * Inserts the widget into the DOM. Actually appends the widget to
 * document's body.
 */
UI.Widget.prototype.attachToDOM = function() {
  document.body.appendChild(this.container);
}

/**
 * Actually does nothing by itself. It's just called everytime a Widget is
 * showed, allowing the widgets to position themselves.
 */
UI.Widget.prototype.setPosition = function() {}

/**
 * Attaches the Widget to the DOM (unless it's already attached to it),
 * then positions it and displays it.
 */
UI.Widget.prototype.show = function()
{
  if (!this.container.parentNode || !this.container.parentNode.tagName) {
    this.attachToDOM();
  }
  this.setPosition();
  this.container.style.display = 'block';
}

// Hides the Widget.
UI.Widget.prototype.hide = function() {
  this._hide();
}

// :nodoc:
UI.Widget.prototype._show = function() {
  if (this.container) this.container.style.display = 'block';
}

// :nodoc:
UI.Widget.prototype._hide = function() {
  if (this.container) this.container.style.display = 'none';
}

// Closes the widgets, using the +onClose+ strategy.
UI.Widget.prototype.close = function(event)
{
  if (event && event.type == 'keyup' && event.keyCode != 27) {
    return;
  }
  
  switch(this.options.onClose)
  {
    case 'hide':    this.hide();    break;
    case 'destroy': this.destroy(); break;
    default: throw new Error("Unknown onClose option: " + this.options.onClose);
  }
}

// Removes the Widget from the DOM and destroys it.
UI.Widget.prototype.destroy = function()
{
  if (this.container)
  {
    if (this.container.parentNode)
    {
      this._hide(); // IE trick: hide before removing
      this.container.parentNode.removeChild(this.container);
    }
    
    if (this._bound_destroy) {
      window.removeEventListener('keyup', this._closeOnEscape, false);
    }
    
    delete this.content;
    delete this.container;
  }
}

// Returns true if Widget is currently displayed, false otherwise.
UI.Widget.prototype.displayed = function() {
  return (!!this.container && this.container.style.display != 'none');
}

// Returns true if Widget is currently displayed, false otherwise.
UI.Widget.prototype.attached = function() {
  return !!(this.container && this.container.parentNode);
}

