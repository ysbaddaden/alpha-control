// TODO: dispatching events wouldn't hurt.
// TODO: better method names for autocomplete & setValue.

UI.Autocompleter = function () {};
UI.Autocompleter.prototype = new UI.ListPicker();

UI.createAutocompleter = function () {
    var widget = new UI.Autocompleter();
    widget.initAutocompleter.apply(widget, arguments);
    return widget;
};

UI.Autocompleter.prototype.initAutocompleter = function (input, options) {
    this.setDefaultOptions({
        param: 'param',
        delay: 200,
        callback: 'callback'
    });
    this.initListPicker(input, options);

    if (!this.options.url) {
        throw new Error("Missing required url option.");
    }
    this.addEventListener('select', this.autocomplete.bind(this));
    this.relativeElement.addEventListener('keyup', this.delayedSearch.bind(this), false);
};

UI.Autocompleter.prototype.setItems = function (items) {
    if (typeof items === 'undefined') {
        items = this.request.responseText;
    }
    UI.ListPicker.prototype.setItems.call(this, items);
};

// Called whenever a selection is selected. Tries to read a data-value
// attribute and falls back to textContent.
UI.Autocompleter.prototype.autocomplete = function (event) {
    var value = event.targetElement.getAttribute('data-value') ||
        event.targetElement.textContent;
    this.setValue(value);
};

// Sets the autocompleted input value and empties the ListPicker.
UI.Autocompleter.prototype.setValue = function (value) {
    this.previousValue = this.relativeElement.value = value;
    this.clearItems();
};

UI.Autocompleter.prototype.search = function () {
    if (this.relativeElement.value.trim() === "") {
        this.setItems('');
        this.hide();
        return;
    } else if (this.relativeElement.value === this.previousValue) {
        return;
    }
    this.relativeElement.classList.add('loading');

    if (this.options.jsonp) {
        this.jsonpRequest();
    } else {
        this.xhrRequest();
    }
    this.previousValue = this.relativeElement.value;
};

UI.Autocompleter.prototype.delayedSearch = function () {
    if (this.delayedSearchTimer) {
        clearTimeout(this.delayedSearchTimer);
    }
    this.delayedSearchTimer = setTimeout(this.search.bind(this), this.options.delay);
};

UI.Autocompleter.prototype.xhrRequest = function () {
    var self = this;
    if (this.request) {
        this.request.abort();
    }
    this.request = new XMLHttpRequest();
    this.request.open('GET', this.url(), true);
    this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    this.request.onreadystatechange = function () {
        if (this.readyState === 4) {
            self.relativeElement.classList.remove('loading');

            if (this.status >= 200 && this.status < 400) {
                self.setItems();
                self.displayOrHide();
            //} else {
            //    if (typeof console !== 'undefined') {
            //        console.error("HTTP Error: " + this.status, self.url());
            //    }
            }
        }
    };
    this.request.send("");
};

UI.Autocompleter.prototype.jsonpRequest = function () {
    var self = this;
    if (this.request) {
        this.request.abort();
    }
    this.request = new JSONP.Request();
    this.request.open(this.url(), function (responseJSON) {
        self.relativeElement.classList.remove('loading');
        self.setItems(responseJSON);
        self.displayOrHide();
    }, { param: this.options.callback });
    this.request.send();
};

UI.Autocompleter.prototype.url = function () {
    return this.options.url + "?" +
        encodeURIComponent(this.options.param) + "=" +
        encodeURIComponent(this.relativeElement.value);
};

