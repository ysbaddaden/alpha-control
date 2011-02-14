UI.Autocomplete = function() {}
UI.Autocomplete.prototype = new UI.ListPicker();

UI.Autocomplete.prototype.initAutocomplete = function(input, options)
{
  if (!options || !options.url) {
    throw new Error("Missing required url option.");
  }
  this.setDefaultOptions({param: 'param'});
  
  this.initListPicker(input, options);
  this.addEventListener('select', this.autocomplete.bind(this));
  
  this.relativeElement.addEventListener('keyup', this.search.bind(this), false);
}

UI.Autocomplete.prototype.search = function(event)
{
  var self = this;
  
  if (this.relativeElement.value.trim() == "")
  {
    this.setItems('');
    this.hide();
    return;
  }
  else if (this.relativeElement.value == this.previousValue) {
    return;
  }
  else if (this.request) {
    this.request.abort();
  }
  this.relativeElement.addClassName('loading');
  
  this.request = new XMLHttpRequest();
  this.request.open('GET', this.uri(), true);
  this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  this.request.onreadystatechange = function()
  {
    if (this.readyState == 4)
    {
      self.relativeElement.removeClassName('loading');
      
      if (this.status >= 200 && this.status < 400)
      {
        self.setItems();
        self.showOrHide();
      }
      else {
        console.error("HTTP Error: " + this.status, self.uri());
      }
    }
  };
  
  this.request.send("");
  this.previousValue = this.relativeElement.value;
}

UI.Autocomplete.prototype.uri = function()
{
  return this.options.url + "?" + this.options.param + "=" +
    encodeURIComponent(this.relativeElement.value)
}

UI.Autocomplete.prototype.setItems = function()
{
  var items = this.request.responseText;
  UI.ListPicker.prototype.setItems.call(this, items);
}

// Called whenever a selection is selected. Tries to read a data-value
// attribute and falls back to innerText.
UI.Autocomplete.prototype.autocomplete = function(event) {
  this.relativeElement.value =  event.target.getAttribute('data-value') || event.target.innerText;
}

