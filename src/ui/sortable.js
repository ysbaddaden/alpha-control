// NOTE: should UI.Sortable inherit from UI.Widget?

UI.Sortable = function() {}

Optionable(UI.Sortable);
Eventable(UI.Sortable, ['dragstart', 'drop']);

UI.Sortable.prototype.initSortable = function(list, options)
{
  this.setDefaultOptions({ selector: 'li' });
  this.setOptions(options);
  
  this.list = list;
  this.list.addEventListener('mousedown', this.start.bind(this), false);
  
  this._drag = this.drag.bind(this);
  this._drop = this.drop.bind(this);
}

UI.Sortable.prototype.start = function(event)
{
  var item = this.findItem(event.target);
  if (item)
  {
    this.dragged = item;
    
    if (this.dispatchEvent('dragstart') === false)
    {
      this.dragged = null;
      return;
    }
    
    this.dragged.classList.add('dragged');
    this.draggedIdx = this.getItemIndex(this.dragged);
    
    document.body.addEventListener('mousemove', this._drag, false);
    document.body.addEventListener('mouseup',   this._drop, false);
    
    event.preventDefault();
  }
}

UI.Sortable.prototype.drag = function(event)
{
  var y, idx, target, parent;
  
  if (this.dragged)
  {
    y = event.clientY || event.pageY;
    
    target = this.findItem(event.target);
    if (target)
    {
      idx = this.getItemIndex(target);
      
      if (idx !== undefined)
      {
        parent = target.get ? target.get('parentNode') : target.parentNode;
        if (idx > this.draggedIdx && y > this.previousY)
        {
          parent.insertAfter(this.dragged, target);
          this.draggedIdx = idx;
        }
        else if (idx < this.draggedIdx && y < this.previousY)
        {
          parent.insertBefore(this.dragged, target);
          this.draggedIdx = idx;
        }
      }
    }
    
    event.preventDefault();
    this.previousY = y;
  }
  
  event.preventDefault();
}

UI.Sortable.prototype.drop = function(event)
{
  if (this.dragged)
  {
    if (this.dispatchEvent('drop') === false) return;
    
    this.dragged.classList.remove('dragged');
    this.dragged = null;
    
    document.body.removeEventListener('mousemove', this._drag, false);
    document.body.removeEventListener('mouseup',   this._drop, false);
    
    event.preventDefault();
  }
}

// Returns the list of matching items.
UI.Sortable.prototype.getItems = function() {
  return this.list.querySelectorAll(this.options.selector);
}

// Returns the list of matching handles (falls back on items' selector).
UI.Sortable.prototype.getHandles = function() {
  return this.list.querySelectorAll(this.options.handle || this.options.selector);
}

// Browses target -> parent until we find a matching item --thought no item is
// searched if handle doesn't match.
UI.Sortable.prototype.findItem = function(target)
{
  if (this.options.handle)
  {
    var handle = this.findHandle(target);
    if (!handle) return;
    target = handle;
  }

  var items = this.getItems();
  do
  {
    for (var i=0, len = items.length; i<len; i++)
    {
      if (target == items[i]) {
        return items[i];
      }
    }
    target = target.parentNode;
  }
  while (target && target.parentNode);
}

UI.Sortable.prototype.findHandle = function(target)
{
  var handles = this.getHandles();
  do
  {
    for (var i=0, len = handles.length; i<len; i++)
    {
      if (target == handles[i]) {
        return handles[i];
      }
    }
    target = target.parentNode;
  }
  while (target && target.parentNode);
}

UI.Sortable.prototype.getItemIndex = function(item)
{
  var items = this.getItems();
  for (var i=0; i<items.length; i++)
  {
    if (items[i] == item) {
      return i;
    }
  }
}
