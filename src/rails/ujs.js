// FIXME: [data-remote] forms with GET method: are params passed?

var UJS = {
  init: function () {
    document.body.addEventListener("click", UJS.onclick, false);
    document.body.addEventListener('ajax:complete', UJS.afterRemoteRequest, false);
    
    var div = document.createElement("div");
    
//    if (typeof div.onsubmit != "undefined") { // disabled since firefox says 'undefined' too :(
      document.body.addEventListener("submit", UJS.onsubmit, false);
//    } else {
    if (typeof div.onsubmit == "undefined") {
      document.body.addEventListener('focusin', UJS.IEFocusMonitor, false);
    }
  },

  onclick: function (event) {
    var target = event.target;
    do {
      if (target.hasAttribute('data-confirm') && !confirm(target.getAttribute('data-confirm'))) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      
      if (target.nodeName == 'A') {
        if (target.getAttribute('data-remote') == 'true') {
          event.preventDefault();
          UJS.remoteRequest(target);
          return;
        } else if (target.hasAttribute('data-method')) {
          event.preventDefault();
          UJS.methodRequest(target);
          return;
        }
      }
      else if (target.nodeName == 'INPUT' && target.type == 'submit') {
        target.setAttribute('submitted', true);
      }
      target = target.get ? target.get('parentNode') : target.parentNode;
    }
    while (target.parentNode && target != this);
  },

  onsubmit: function (event) {
    var inputs = event.target.querySelectorAll('input[type=submit][data-disable-with]');
    Array.prototype.forEach.call(inputs, function (input) {
      input.disabled = true;
      input.setAttribute('data-original-value', input.value);
      input.value = input.getAttribute('data-disable-with');
    });
    
    if (event.target.getAttribute('data-remote') == 'true') {
      event.preventDefault();
      UJS.remoteRequest(event.target);
    }
  },

  remoteRequest: function (target) {
    var self = this, method, url, request, body;
    this.dispatchEvent(target, 'ajax:before');
    
    if (target.nodeName == 'FORM') {
      url    = target.action;
      method = target.getAttribute('method') || 'post';
      body   = UJS.serialize(target);
    } else {
      url    = target.href;
      method = target.getAttribute('data-method') || 'get';
    }
    
    request = new Rails.Request();
    request.open(method, url);
    request.addEventListener('loadend', function (event) { self.dispatchEvent(target, 'ajax:complete', request); });
    request.addEventListener('load',    function (event) { self.dispatchEvent(target, 'ajax:success',  request); });
    request.addEventListener('error',   function (event) { self.dispatchEvent(target, 'ajax:failure',  request); });
    request.send(body);
    
    this.dispatchEvent(target, 'ajax:after');
  },

  // IMPROVE: use a well tested HTMLFormElement.prototype.serialize() method instead.
  serialize: function (form) {
    var params = [];
    var inputs = form.querySelectorAll('input,select,textarea');
    Array.prototype.forEach.call(inputs, function (input) {
      if (!input.name
        || input.disabled
        || input.type == 'file'
        || (input.type == 'checkbox' && !input.checked)
        || (input.type == 'submit' && !input.hasAttribute('submitted')))
      {
        return;
      }
      if (input.type == 'select' && input.multiple) {
        for (var i=0, len=this.selectedOptions.length; i<len; i++) {
          params.push(encodeURIComponent(input.name) + '=' + encodeURIComponent(this.selectedOptions[i].value));
        }
      } else {
        params.push(encodeURIComponent(input.name) + '=' + encodeURIComponent(input.value));
      }
    }, this);
    return params.join('&');
  },

  methodRequest: function (target) {
    var form = document.createElement('form');
    form.setAttribute('action', target.href);
    
    var method = target.getAttribute('data-method').toLowerCase();
    
    if (method == 'get' || method == 'post') {
      form.setAttribute('method', method);
    } else {
      var input = document.createElement('input');
      input.setAttribute('type',  'hidden');
      input.setAttribute('name',  '_method');
      input.setAttribute('value', method);
      
      form.appendChild(input);
      form.setAttribute('method', 'post');
    }
    
    var input = document.createElement('input');
    input.setAttribute('type',  'hidden');
    input.setAttribute('name',  Rails.readMeta('csrf-param'));
    input.setAttribute('value', Rails.readMeta('csrf-token'));
    form.appendChild(input);
    
    document.body.appendChild(form);
    form.submit();
  },

  dispatchEvent: function (target, type, request) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(type, true, true);
    event.memo = request;
    return target.dispatchEvent(event);
  },

  afterRemoteRequest: function (event) {
    var inputs = event.target.querySelectorAll('input[type=submit]');
    Array.prototype.forEach.call(inputs, function (input) {
      input.removeAttribute('submitted');
    });
    
    var inputs = event.target.querySelectorAll('input[type=submit][data-disable-with]');
    Array.prototype.forEach.call(inputs, function (input) {
      if (!input.disabled) return;
      input.value = input.getAttribute('data-original-value');
      input.removeAttribute('data-original-value');
      input.disabled = false;
    });
  },

  // submit events don't bubble in IE6, we thus listen for focus,
  // which bubbles, to manually attach one.
  IEFocusMonitor: function (event) {
    var types = ['INPUT', 'SELECT', 'TEXTAREA', 'FORM'];
    if (types.indexOf(event.target.nodeName) != -1) {
      var form = event.target;
      while (form && form.nodeName != 'FORM') {
        form = form.parentNode;
      }
      form = Alpha.$(form);
      
      if (form && !form.hasAttribute('data-rails-onsubmit')) {
        form.setAttribute('data-rails-onsubmit', '1');
        form.addEventListener('submit', UJS.onsubmit, false);
      }
    }
  }
};

UJS.init();

