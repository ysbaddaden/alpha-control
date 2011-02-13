Element.prototype.getParent = function(nodeName)
{
  var element = this;
  nodeName = nodeName.toUpperCase();
  
  while(element && element.nodeName != nodeName && element.parentNode) {
    element = element.get ? element.get('parentNode') : element.parentNode;
  }
  
  return element.parentNode ? element : undefined;
}

// NOTE: shall UI.Sortable inherit from UI.Widget?

UI.Sortable = function() {}
Optionable(UI.Sortable);

UI.Sortable.prototype.initSortable = function(list, options)
{
  this.setDefaultOptions({nodeName: 'LI'});
  this.setOptions(options);
  this.options.nodeName = this.options.nodeName.toUpperCase();
  
  this.list = list;
  this.list.addEventListener('mousedown', this.start.bind(this), false);
  
  this._drag = this.drag.bind(this);
  this._stop = this.stop.bind(this);
}

UI.Sortable.prototype.start = function(event)
{
  var item = event.target.getParent(this.options.nodeName);
  if (item)
  {
    this.dragged = item;
    this.dragged.addClassName('dragged');
    this.draggedIdx = this.getItemIndex(this.dragged);
    
    document.body.addEventListener('mousemove', this._drag, false);
    document.body.addEventListener('mouseup',   this._stop, false);
    
    event.preventDefault();
  }
}

UI.Sortable.prototype.drag = function(event)
{
  var y, idx;
  
  if (this.dragged)
  {
    y = event.clientY || event.pageY;
    
    target = event.target.getParent(this.options.nodeName);
    idx = this.getItemIndex(target);
    
    if (idx !== undefined)
    {
      if (idx > this.draggedIdx && y > this.previousY)
      {
        target.parentNode.insertAfter(this.dragged, target);
        this.draggedIdx = idx;
      }
      else if (idx < this.draggedIdx && y < this.previousY)
      {
        target.parentNode.insertBefore(this.dragged, target);
        this.draggedIdx = idx;
      }
    }
    
    event.preventDefault();
    this.previousY = y;
  }
  
  event.preventDefault();
}

UI.Sortable.prototype.stop = function(event)
{
  if (this.dragged)
  {
    this.dragged.removeClassName('dragged');
    this.dragged = null;
    
    document.body.removeEventListener('mousemove', this._drag, false);
    document.body.removeEventListener('mouseup',   this._stop, false);
    
    event.preventDefault();
  }
}

UI.Sortable.prototype.getItemIndex = function(item)
{
  var items = this.list.getElementsByTagName(this.options.nodeName);
  for (var i=0; i<items.length; i++)
  {
    if (items[i] == item) {
      return i;
    }
  }
}

