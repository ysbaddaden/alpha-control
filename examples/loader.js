function load(relativePath)
{
  var FILES = [
    'alpha-core.js',
    
    'support/function.js',
    'support/regexp.js',
    'support/inflector.js',
    'support/string.js',
    'support/element.js',
    'support/color.js',
    'support/optionable.js',
    'support/eventable.js',
    'support/jsonp.js',
    
    'ui/widget.js',
    'ui/overlay.js',
    'ui/notification.js',
    'ui/window.js',
    'ui/dialog.js',
    'ui/alert.js',
    'ui/picker.js',
    'ui/list_picker.js',
    'ui/autocompleter.js',
    'ui/sortable.js'
  ];
  
  if (relativePath) {
    relativePath += '/';
  }
  
  for (var i=0; i<FILES.length; i++) {
    document.write('<script src="' + relativePath + '../src/' + FILES[i] + '"></script>');
  }
}
