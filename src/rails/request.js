var Rails = {};

// Executes an HTTP request to a Ruby on Rails server. This object is made
// necessary by the request forgery protection of ruby on rails, which requires
// either an unique token to be passed either as a parameter or as a
// X-CSRF-Token HTTP header.
//
// The implementation is modeled after XMLHttpRequest 2 which uses events for
// callbacks. If you ever overwrite the onreadystatechange method please be
// sure to call the Rails.Request.prototype.onreadystatechange method or events
// wouldn't be dispatched.
//
// Example:
//
//   var r = new Rails.Request();
//   r.open('get', '/posts');
//   r.addEventListener('loadstart', onrequest);   // readyState = 3
//   r.addEventListener('abort',     onabort);     // abort()
//   r.addEventListener('error',     onfailure);   // readyState = 4 && status >= 400
//   r.addEventListener('load',      onsuccess);   // readyState = 4 && status < 400
//   r.addEventListener('loadend',   oncomplete);  // readyState = 4
//   r.send();
//
// NOTE: encode and post params as application/json instead of application/x-www-form-urlencoded?

Rails.Request = function () {
    this.xhr = new XMLHttpRequest();
    this.upload = this.xhr.upload;
};
Eventable(Rails.Request, [ 'loadstart', 'abort', 'load', 'error', 'loadend' ]);

Rails.createRequest = function () {
    var req = new Rails.Request();
    req.open.apply(req, arguments);
    return req;
};

Rails.Request.prototype.createEvent = function (type) {
    var event = new Eventable.Event();
    event.initEvent(type, false, true);
    event.request = this.xhr;
    return event;
};

Rails.Request.prototype.open = function (method, url) {
    method = method.toLowerCase();
    this.xhr.open(method.toUpperCase(), url, true);
    this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    if (method !== 'get') {
        var csrf_token = Rails.readMeta('csrf-token');
        if (csrf_token) {
            this.xhr.setRequestHeader('X-CSRF-Token', csrf_token);
        }
    }
    this.xhr.onreadystatechange = this.onreadystatechange.bind(this);
};

Rails.Request.prototype.setRequestHeader = function () {
    this.xhr.setRequestHeader.apply(this.xhr, arguments);
};

Rails.Request.prototype.onreadystatechange = function () {
    switch (this.xhr.readyState) {
    case 3:
        this.dispatchEvent('loadstart');
        break;
    case 4:
        this.dispatchEvent((this.xhr.status < 400) ? 'load' : 'error');
        this.dispatchEvent('loadend');
        this.cleanup();
        break;
    }
};

Rails.Request.prototype.send = function (body_or_params, encode) {
    var body;
    if (encode || encode === undefined) {
        this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        if (typeof body_or_params === 'string') {
            body = body_or_params;
        } else {
            body = HTTP.toQueryString(body_or_params);
        }
    } else {
        body = body_or_params;
    }
    this.xhr.send(body || '');
};

Rails.Request.prototype.abort = function () {
    if (this.xhr) {
        this.xhr.abort();
        this.dispatchEvent('abort');
        this._clear();
    }
};

Rails.Request.prototype.cleanup = function () {
    this.xhr = null;
};

Rails.readMeta = function (name) {
    var meta = document.querySelector("meta[name=" + name + "]");
    return meta ? meta.getAttribute('content') : null;
};

