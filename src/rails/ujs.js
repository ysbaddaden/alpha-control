// FIXME: [data-remote] forms with GET method: are params passed?

(function () {
    var onclick = function (event) {
        var target = event.target;
        do {
            if (target.hasAttribute('data-confirm') && !confirm(target.getAttribute('data-confirm'))) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            if (target.nodeName === 'A') {
                if (target.getAttribute('data-remote') === 'true') {
                    event.preventDefault();
                    remoteRequest(target);
                    return;
                } else if (target.hasAttribute('data-method')) {
                    event.preventDefault();
                    methodRequest(target);
                    return;
                }
            } else if (target.nodeName === 'INPUT' && target.type === 'submit') {
                target.setAttribute('submitted', true);
            }
            target = target.parentNode;
        }
        while (target.parentNode && target !== this);
    };

    var onsubmit = function (event) {
        var inputs = event.target.querySelectorAll('input[type=submit][data-disable-with]');
        Array.prototype.forEach.call(inputs, function (input) {
            input.disabled = true;
            input.setAttribute('data-original-value', input.value);
            input.value = input.getAttribute('data-disable-with');
        });
        if (event.target.getAttribute('data-remote') === 'true') {
            event.preventDefault();
            remoteRequest(event.target);
        }
    };

    var remoteRequest = function (target) {
        var method, url, request, body;
        dispatchEvent(target, 'ajax:before');

        if (target.nodeName === 'FORM') {
            url    = target.action;
            method = target.getAttribute('method') || 'post';
            body   = target.serialize();
        } else {
            url    = target.href;
            method = target.getAttribute('data-method') || 'get';
        }

        request = new Rails.Request();
        request.open(method, url);
        request.addEventListener('loadend', function (event) {
            dispatchEvent(target, 'ajax:complete', request);
        });
        request.addEventListener('load', function (event) {
            dispatchEvent(target, 'ajax:success', request);
        });
        request.addEventListener('error', function (event) {
            dispatchEvent(target, 'ajax:failure', request);
        });
        request.send(body || '');

        dispatchEvent(target, 'ajax:after');
    };

    var methodRequest = function (target) {
        var input;
        var form = document.createElement('form');
        form.setAttribute('action', target.href);

        var method = target.getAttribute('data-method').toLowerCase();
        if (method === 'get' || method === 'post') {
            form.setAttribute('method', method);
        } else {
            input = document.createElement('input');
            input.setAttribute('type',  'hidden');
            input.setAttribute('name',  '_method');
            input.setAttribute('value', method);
            form.append(input);
            form.setAttribute('method', 'post');
        }

        input = document.createElement('input');
        input.setAttribute('type',  'hidden');
        input.setAttribute('name',  Rails.readMeta('csrf-param'));
        input.setAttribute('value', Rails.readMeta('csrf-token'));
        form.append(input);

        document.body.append(form);
        form.submit();
    };

    var dispatchEvent = function (target, type, request) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, true);
        event.memo = request;
        return target.dispatchEvent(event);
    };

    var afterRemoteRequest = function (event) {
        var inputs = event.target.querySelectorAll('input[type=submit]');
        Array.prototype.forEach.call(inputs, function (input) {
            input.removeAttribute('submitted');
        });

        inputs = event.target.querySelectorAll('input[type=submit][data-disable-with]');
        Array.prototype.forEach.call(inputs, function (input) {
            if (input.disabled) {
                input.value = input.getAttribute('data-original-value');
                input.removeAttribute('data-original-value');
                input.disabled = false;
            }
        });
    };

    // Submit events don't bubble in IE, we thus listen for focus, which
    // bubbles, to manually attach one.
    var IEFocusMonitor = function (event) {
        var types = ['INPUT', 'SELECT', 'TEXTAREA', 'FORM'];
        if (types.indexOf(event.target.nodeName) !== -1) {
            var form = event.target.findParent('form');
            if (form && !form.hasAttribute('data-rails-onsubmit')) {
                form.setAttribute('data-rails-onsubmit', '1');
                form.addEventListener('submit', onsubmit, false);
            }
        }
    };

    document.addEventListener('DOMContentLoaded', function (e) {
        document.body.addEventListener('click',         onclick,            false);
        document.body.addEventListener('ajax:complete', afterRemoteRequest, false);
        document.body.addEventListener('submit',        onsubmit,           false);
        if (document.createElement('div').onsubmit === undefined) {
            document.body.addEventListener('focusin', IEFocusMonitor, false);
        }
    }, false);
}());
