// FIXME: find better method names than autocomplete & setValue.

UI.Autocomplete = function() {}
UI.Autocomplete.prototype = new UI.ListPicker();

UI.Autocomplete.prototype.initAutocomplete = function(input, options)
{
  if (!options || !options.url) {
    throw new Error("Missing required url option.");
  }
  this.setDefaultOptions({
    param: 'param',
    delay: 200,
    callback: 'callback'
  });
  
  this.initListPicker(input, options);
  this.addEventListener('select', this.autocomplete.bind(this));
  
  this.relativeElement.addEventListener('keyup', this.delayedSearch.bind(this), false);
}

UI.Autocomplete.prototype.delayedSearch = function(event)
{
  var self = this;
  
  if (this.delayedSearchTimer) {
    clearTimeout(this.delayedSearchTimer);
  }
  
  this.delayedSearchTimer = setTimeout(function() {
    self.search(event);
  }, this.options.delay);
}

UI.Autocomplete.prototype.search = function(event)
{
  // shall we make remote request?
  if (this.relativeElement.value.trim() == "")
  {
    this.setItems('');
    this.hide();
    return;
  }
  else if (this.relativeElement.value == this.previousValue) {
    return;
  }
  this.relativeElement.classList.add('loading');
  
  // remote request
  if (this.options.jsonp) {
    this.jsonp_request();
  }
  else {
    this.xhr_request()
  }
  
  this.previousValue = this.relativeElement.value;
}

UI.Autocomplete.prototype.jsonp_request = function()
{
  var self = this;
  
  if (this.request) {
    this.request.abort();
  }
  this.request = new JSONP.Request();
  this.request.open(this.url(), function(responseJSON)
  {
    self.relativeElement.classList.remove('loading');
    self.setItems(responseJSON);
    self.showOrHide();
  }, {param: this.options.callback});
  this.request.send();
}

UI.Autocomplete.prototype.xhr_request = function()
{
  var self = this;
  
  if (this.request) {
    this.request.abort();
  }
  this.request = new XMLHttpRequest();
  this.request.open('GET', this.url(), true);
  this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  this.request.onreadystatechange = function()
  {
    if (this.readyState == 4)
    {
      self.relativeElement.classList.remove('loading');
      
      if (this.status >= 200 && this.status < 400)
      {
        self.setItems();
        self.showOrHide();
      }
      else {
        console && console.error("HTTP Error: " + this.status, self.url());
      }
    }
  };
  
  this.request.send("");
}

UI.Autocomplete.prototype.setItems = function(items)
{
  if (typeof items == 'undefined') {
    items = this.request.responseText;
  }
  UI.ListPicker.prototype.setItems.call(this, items);
}

// Called whenever a selection is selected. Tries to read a data-value
// attribute and falls back to innerText.
UI.Autocomplete.prototype.autocomplete = function(event) {
  this.setValue(event.targetElement.getAttribute('data-value') || event.targetElement.innerText);
}

// Sets the autocompleted input value and empties the the list picker.
UI.Autocomplete.prototype.setValue = function(value)
{
  this.previousValue = this.relativeElement.value = value;
  this.clearItems();
}

UI.Autocomplete.prototype.url = function()
{
  return this.options.url + "?" + this.options.param + "=" +
    encodeURIComponent(this.relativeElement.value)
}

