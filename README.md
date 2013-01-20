# AlphaControl

AlphaControl extends JavaScript and the DOM from the ECMAScript and W3C
standards. This is different from AlphaCore which shims and polyfills respecting
the afore mentioned standards.

Any modern browser is supported, which means IE8+. AlphaCore is required until
browsers are up to date with the current DOM draft.

## Support

Extends native objects and prototypes to add methods like `Object.extend()`,
`RegExp.escape()` and `String.prototype.camelize()`.

Also gives access to new objects like Inflector and I18n, plus some others made
to extend your objects and prototypes, like Eventable and Optional. Eventable
for instance, allows you to listen and dispatch events in your objects.

## UI

UI objects for building dialogs, pickers, to sort objects, etc.

In constrast to jQuery UI and consors, all the UI in AlphaControl are JavaScript
constructs, which means that you won't mess with HTML to manipulate UI components,
but will instead instanciate a dialog, set its title and contents and eventually
display it.

For example here is how you'd handle an alert dialog:

```javascript
var dialog = UI.createWarningAlert();
dialog.setMessageText("Error: lost connection");
dialog.seInformativeText("The connection to the remote server has been cut. " +
    "Please check your Internet connection, or wait until we're back online.");

dialog.addEventListener('validate', function (e) {
    // do something when the user clicked the OK button
    // call e.preventDefault() to prevent the dialog from being closed
}, false);

dialog.display();
```

## Rails

Provides support for Rails' UJS. Also provides a Rails.Request object, which
mimics the XMLHttpRequest2 interface (with events), transparently taking care of
the X-CSRF-Token header.

## Authors

  - Julien Portalier <julien@portalier.com>

