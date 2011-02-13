// NOTE: shall UI.Sortable inherit from UI.Widget?
// TODO: shall dispatch events on start, drag and stop.

UI.Sortable = function() {}
Optionable(UI.Sortable);

UI.Sortable.prototype.initSortable = function(list, options)
{
  this.setDefaultOptions({selector: 'li'});
  this.setOptions(options);
  
  this.list = list;
  this.list.addEventListener('mousedown', this.start.bind(this), false);
  
  this._drag = this.drag.bind(this);
  this._stop = this.stop.bind(this);
}

UI.Sortable.prototype.start = function(event)
{
  var item = this.findItem(event.target);
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
  var y, idx, target;
  
  if (this.dragged)
  {
    y = event.clientY || event.pageY;
    
    target = this.findItem(event.target);
    if (target)
    {
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

UI.Sortable.prototype.getItems = function() {
  return this.list.querySelectorAll(this.options.selector);
}

// browses target -> parent until we find an item.
UI.Sortable.prototype.findItem = function(target)
{
  var items = this.getItems();
  do
  {
    for (var i=0; i<items.length; i++)
    {
      if (target == items[i]) {
        return items[i];
      }
    }
    target = target.parentNode;
  }
  while(target && target.parentNode);
}

UI.Sortable.prototype.getItemIndex = function(item)
{
//  var items = this.list.getElementsByTagName(this.options.nodeName);
  var items = this.getItems();
  for (var i=0; i<items.length; i++)
  {
    if (items[i] == item) {
      return i;
    }
  }
}

