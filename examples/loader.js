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
    
    'ui/widget.js',
    'ui/dialog.js',
    'ui/overlay.js',
    'ui/modal_dialog.js',
    'ui/notification.js',
    'ui/picker.js',
    'ui/list_picker.js',
    
    'ui/sortable.js',
    'ui/autocomplete.js'
  ];
  
  if (relativePath) {
    relativePath += '/';
  }
  
  for (var i=0; i<FILES.length; i++) {
    document.write('<script src="' + relativePath + '../src/' + FILES[i] + '"></script>');
  }
}
