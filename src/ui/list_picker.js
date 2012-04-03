UI.ListPicker = function () {};
UI.ListPicker.prototype = new UI.Picker();

Eventable(UI.ListPicker, ['select']);

UI.createListPicker = function () {
  var widget = new UI.ListPicker();
  widget.initListPicker.apply(widget, arguments);
  return widget;
};

UI.ListPicker.prototype.initListPicker = function (relativeElement, options) {
  this.setDefaultOptions({
    activate:   ['focus', 'click'],
//    deactivate: ['blur'],
    autoMarkFirst: false
  });
  this.initPicker(relativeElement, options);
  this.container.classList.add('ui-list-picker');
  
  this.list = document.createElement('ul');
  this.list.addEventListener('click', this.clickListener.bind(this), false);
  this.list.addEventListener('mouseover', this.hoverListener.bind(this), false);
  this.setContent(this.list);
  
  this.relativeElement.setAttribute('autocomplete', 'off');
  this.relativeElement.addEventListener('focus',    this.activate.bind(this),    false);
  this.relativeElement.addEventListener('click',    this.activate.bind(this),    false);
//  this.relativeElement.addEventListener('blur',     this.deactivate.bind(this),  false);
  this.relativeElement.addEventListener('keypress', this.keypressListener.bind(this), false);
  this.relativeElement.addEventListener('keyup',    this.keyupListener.bind(this),    false);
  
  var self = this;
  this.addEventListener('activate', function (event) {
    if (!self.hasItems()) {
      event.preventDefault();
    }
  });
};

//UI.ListPicker.prototype.deactivate = function () {
//  UI.ListPicker.prototype.deactivate.call(this);
//}

// items

UI.ListPicker.prototype.setItems = function (items) {
  if (typeof items == 'string') {
    this.list.innerHTML = items;
  } else if (items.nodeName == '#document-fragment') {
    this.list.innerHTML = '';
    this.list.appendChild(items);
  } else {
    this.list.innerHTML = '';
    for (var i=0, len=items.length; i<len; i++) {
      this.list.appendChild(items[i]);
    }
  }
  
  if (this.options.autoMarkFirst && this.hasItems()) {
    this.markSelection(this.getItem(0));
  } else {
    this.unmarkSelection();
  }
};

UI.ListPicker.prototype.getItems = function () {
  return this.list.getElementsByTagName('li');
};

UI.ListPicker.prototype.getItem = function (index) {
  return this.list.getElementsByTagName('li')[index];
};

UI.ListPicker.prototype.hasItems = function (items) {
  return this.getItems().length > 0;
};

UI.ListPicker.prototype.clearItems = function () {
  this.list.innerHTML = '';
};

// selection

UI.ListPicker.prototype.markSelection = function (item) {
  if (item) {
    if (this.selection) {
      this.selection.classList.remove('ui-selected');
    }
    this.selection = item;
    this.selection.classList.add('ui-selected');
  }
};

UI.ListPicker.prototype.unmarkSelection = function () {
  if (this.selection) {
    this.selection.classList.remove('ui-selected');
    this.selection = null;
  }
};

UI.ListPicker.prototype.moveSelectionUp = function () {
  var item, items;
  
  if (this.selection) {
    item = this.selection.get ?
      this.selection.get('previousElementSibling') :
      this.selection.previousElementSibling;
  } else if (this.hasItems()) {
    items = this.getItems();
    item  = items[items.length - 1];
  }
  this.markSelection(item);
};

UI.ListPicker.prototype.moveSelectionDown = function () {
  var item;
  
  if (this.selection) {
    item = this.selection.get ?
      this.selection.get('nextElementSibling') :
      this.selection.nextElementSibling;
  }
  else if (this.hasItems()) {
    item = this.getItems()[0];
  }
  this.markSelection(item);
};

UI.ListPicker.prototype.selectSelection = function () {
  this.hide();
  
  if (this.selection) {
    var event = this.createEvent('select');
    event.targetElement = this.selection;
    this.dispatchEvent(event);
    this.unmarkSelection();
  }
};

// display

UI.ListPicker.prototype.displayOrHide = function () {
  if (this.hasItems) {
    this.display();
  } else {
    this.hide();
  }
};

UI.ListPicker.prototype.cancel = function (event) {
  this.deactivate();
  
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
};

// callbacks

UI.ListPicker.prototype.clickListener = function (event) {
  var element = event.target.findParentNode('li');
  if (element) {
    this.selection = element;
    this.selectSelection();
  }
};

UI.ListPicker.prototype.hoverListener = function (event) {
  var element = event.target.findParentNode('li');
  if (element) {
    this.markSelection(element);
  }
};

UI.ListPicker.prototype.keypressListener = function (event) {
  switch(event.keyCode) {
  case 27: // esc
    this.cancel(event);
    return;
  case 13: // enter
    if (this.displayed()) {
      this.selectSelection();
      event.stopPropagation();
      event.preventDefault();
    }
    return;
  }
};

UI.ListPicker.prototype.keyupListener = function (event) {
  switch(event.keyCode) {
  case 38: // up
    this.moveSelectionUp();
    return;
  case 40: // down
    this.moveSelectionDown();
    return;
  case 13: // enter
    return;
  case 27: // sec
    this.cancel(event);
    return;
  }
  this.displayOrHide();
};

/*
// TODO: Dispatch activate/deactivate events
// IMPROVE: shall we move activate/deactivate to UI.Picker itself?

UI.ListPicker = function () {}
UI.ListPicker.prototype = new UI.Picker();

Eventable(UI.ListPicker, ['activate', 'deactivate', 'select']);

UI.ListPicker.prototype.initListPicker = function (input, options)
{
  this.setDefaultOptions({autoMarkFirst: false});
  this.initPicker(input, options);
  this.container.classList.add('list-picker');
  
  this.relativeElement.setAttribute('autocomplete', 'off');
  this.relativeElement.addEventListener('focus',    this.activate.bind(this),    false);
  this.relativeElement.addEventListener('click',    this.activate.bind(this),    false);
  this.relativeElement.addEventListener('blur',     this.deactivate.bind(this),  false);
  this.relativeElement.addEventListener('keypress', this.keypress_cb.bind(this), false);
  this.relativeElement.addEventListener('keyup',    this.keyup_cb.bind(this),    false);
  
  this.list = document.createElement('ul');
  this.list.addEventListener('click', this.click_cb.bind(this), false);
  this.setContent(this.list);
}

// items

UI.ListPicker.prototype.setItems = function (items)
{
  if (typeof items == 'string') {
    this.list.innerHTML = items;
  }
  else if (items.nodeName == '#document-fragment')
  {
    this.list.innerHTML = '';
    this.list.appendChild(items);
  }
  else
  {
    this.list.innerHTML = '';
    
    for (var i=0, len=items.length; i<len; i++) {
      this.list.appendChild(items[i]);
    }
  }
  
  if (this.options.autoMarkFirst && this.hasItems()) {
    this.markSelection(this.getItem(0));
  }
  else {
    this.unmarkSelection();
  }
}

UI.ListPicker.prototype.getItems = function () {
  return this.list.getElementsByTagName('li');
}

UI.ListPicker.prototype.getItem = function (index) {
  return this.list.getElementsByTagName('li')[index];
}

UI.ListPicker.prototype.hasItems = function (items) {
  return this.getItems().length > 0;
}

UI.ListPicker.prototype.clearItems = function () {
  this.list.innerHTML = '';
}

// selection

UI.ListPicker.prototype.markSelection = function (item)
{
  if (item)
  {
    if (this.selection) {
      this.selection.classList.remove('selected');
    }
    this.selection = item;
    this.selection.classList.add('selected');
  }
},

UI.ListPicker.prototype.unmarkSelection = function ()
{
  if (this.selection)
  {
    this.selection.classList.remove('selected');
    this.selection = null;
  }
},

UI.ListPicker.prototype.moveSelectionUp = function ()
{
  var item, items;
  
  if (this.selection)
  {
    item = this.selection.get ?
      this.selection.get('previousElementSibling') :
      this.selection.previousElementSibling;
  }
  else if (this.hasItems())
  {
    items = this.getItems();
    item  = items[items.length - 1];
  }
  
  this.markSelection(item)
},

UI.ListPicker.prototype.moveSelectionDown = function ()
{
  var item;
  
  if (this.selection)
  {
    item = this.selection.get ?
      this.selection.get('nextElementSibling') :
      this.selection.nextElementSibling;
  }
  else if (this.hasItems()) {
    item = this.getItems()[0];
  }
  
  this.markSelection(item)
},

UI.ListPicker.prototype.selectSelection = function ()
{
  this.hide();
  
  if (this.selection)
  {
    var event = this.createEvent('select');
    event.targetElement = this.selection;
    this.dispatchEvent(event);
    this.unmarkSelection();
  }
}

// display

UI.ListPicker.prototype.displayOrHide = function ()
{
  var method = this.hasItems() ? 'show' : 'hide';
  this[method]();
}

UI.ListPicker.prototype.activate = function (event)
{
//  if (!this.dispatchEvent('activate') && this.hasItems()) {
  if (this.hasItems()) {
    this.show();
  }
}

UI.ListPicker.prototype.deactivate = function (event) {
//  this.dispatchEvent('deactivate');
}

UI.ListPicker.prototype.cancel = function (event)
{
  this.hide();
  
  if (event)
  {
    event.stopPropagation();
    event.preventDefault();
  }
}

// callbacks

// IMPROVE: search for a parent LI if target isn't an LI.
UI.ListPicker.prototype.click_cb = function (event)
{
  if (event.target.tagName.toLowerCase() == 'li')
  {
    this.selection = event.target;
    this.selectSelection();
  }
}

UI.ListPicker.prototype.keypress_cb = function (event)
{
  switch(event.keyCode)
  {
    case 27: // esc
      this.cancel(event);
      return;
    
    case 13: // enter
      if (this.displayed())
      {
        this.selectSelection();
        event.stopPropagation();
        event.preventDefault();
      }
      return;
  }
}

UI.ListPicker.prototype.keyup_cb = function (event)
{
  switch(event.keyCode)
  {
    case 38: this.moveSelectionUp();   return; // up
    case 40: this.moveSelectionDown(); return; // down
    case 13: return;                           // enter
    case 27: this.cancel(event); return;       // esc
  }
  this.displayOrHide();
}
*/
