var Unit = {}

Unit.Failure = function(message)
{
  this.name    = 'Unit.Failure'
  this.message = message;
}

Unit.TestCase = function(className, methods)
{
  this.name = className;
  this._tests = [];
  
  for (var methodName in methods)
  {
    this[methodName] = methods[methodName];
    
    if (methodName.match(/^test/)) {
      this._tests.push(methodName)
    }
  }
  
  Unit.TestCase.testCases[this.name] = this;
}

Unit.TestCase.testCases = {};

Unit.TestCase.run = function(runner)
{
  var testCase;
  
  Unit.TestCase.runner = runner;
  Unit.TestCase._queued = [];
  
  for (var name in Unit.TestCase.testCases)
  {
    testCase = Unit.TestCase.testCases[name];
    
    for (var i=0, len=testCase._tests.length; i<len; i++) {
      Unit.TestCase._queued.push([name, testCase._tests[i]]);
    }
  }
  
  Unit.TestCase._process();
}

Unit.TestCase._process = function()
{
  var test;
  
  if (Unit.TestCase._queued.length > 0)
  {
    Unit.TestCase.blocking = false;
    
    test = Unit.TestCase._queued.shift();
    this.testCase = Unit.TestCase.testCases[test[0]];
    this.testCase.runTest(test[1]);
    
    Unit.TestCase._wait();
  }
  else {
    Unit.TestCase.runner.finished();
  }
}

Unit.TestCase._wait = function()
{
  if (Unit.TestCase.blocking) {
    setTimeout(Unit.TestCase._wait, 10);
  }
  else
  {
    Unit.TestCase.runner.testEnd();
    Unit.TestCase._process();
  }
}

Unit.TestCase.prototype.setup    = function() {}
Unit.TestCase.prototype.teardown = function() {}

Unit.TestCase.prototype.async = function() {
  Unit.TestCase.blocking = true;
}

Unit.TestCase.prototype.sync = function(func)
{
  this._catcher(func);
  
  if (Unit.TestCase.blocking) {
    this._teardown();
  }
  Unit.TestCase.blocking = false;
}

Unit.TestCase.prototype.runTest = function(testName)
{
  this.currentTest = testName;
  Unit.TestCase.runner.testStart(this.name, this.currentTest);
  
  this._catcher(function()
  {
    this._teardowned = false;
    this.setup();
    this[this.currentTest]();
  });
  
  if (!Unit.TestCase.blocking) {
    this._teardown();
  }
}

Unit.TestCase.prototype._catcher = function(func)
{
  this.failed = false;
  
  try {
    func.call(this);
  }
  catch (exception)
  {
    if (exception instanceof Unit.Failure) {
      Unit.TestCase.runner.addFailure(exception);
    }
    else {
      Unit.TestCase.runner.addError(exception);
    }
    this.failed = true;
  }
}

Unit.TestCase.prototype._teardown = function()
{
  if (!this._teardowned)
  {
    this._catcher(this.teardown);
    this._teardowned = true;
  }
}

Unit.AssertionMessage = function(header, template, args)
{
  var parts = template.split(/\?/);
  this.message = "";
  
  if (header) {
    this.message = header + "\n";
  }
  
  for (var i=0, len = parts.length; i<len; i++)
  {
    this.message += parts[i];
    
    if (args.length) {
      this.message += Unit.AssertionMessage.argToString(args.shift());
    }
  }
}

Unit.AssertionMessage.prototype.toString = function() {
  return this.message;
}

Unit.AssertionMessage.argToString = function(arg)
{
  var className = Unit.AssertionMessage.getClassName(arg), value;
  
  if (className == 'Function') {
    value = 'function() {...}';
  }
  else if (className == 'Boolean') {
    value = arg ? 'true' : 'false';
  }
  else if (typeof arg == 'undefined') {
    value = 'undefined';
  }
  else if (arg === null) {
    value = 'null'; 
  }
  else if (className == 'String') {
    value = '"' + arg.replace(new RegExp('"', 'g'), '\\"') + '"';
  }
  else if (className == 'Array')
  {
    var parts = [];
    for (var i=0; i<arg.length; i++) {
      parts.push(this.argToString(arg[i]));
    }
    value = '[' + parts.join(', ') + ']';
  }
  else if (className == 'Object' && !arg.tagName)
  {
    var parts = [];
    for (var i in arg) {
      parts.push(i + ': ' + this.argToString(arg[i]));
    }
    value = '{' + parts.join(', ') + '}';
  }
  else if (className == 'RegExp')
  {
    var value = '/';
    value += arg.source.replace(new RegExp('/', 'g'), '\\/');
    value += '/';
    
    if (arg.ignoreCase) value += 'i';
    if (arg.global)     value += 'g';
    if (arg.multiline)  value += 'm';
  }
  else if (className == 'Number') {
    value = arg.toString();
  }
  else {
    value = "" + arg;
  }
  
  return value;
}

Unit.AssertionMessage.getClassName = function(obj) {
  return Object.prototype.toString.call(obj).match(/\[object (.+?)\]/)[1];
}

Unit.TestCase.prototype.assert = function(test, message)
{
  if (!test) {
    throw new Unit.Failure(message || "Failed assertion, no message given.");
  }
  Unit.TestCase.runner.addAssertion();
}

Unit.TestCase.prototype.assertFunction = function(func, message) {
  this.assert(func(), message || "Expected function to return true value.");
}

Unit.TestCase.prototype.assertEqual = function(expected, actual, message)
{
  var fullMessage = this.buildMessage(message, "<?> expected but was\n<?>.",
    expected, actual);
  this.assert(this._equiv(expected, actual), fullMessage);
}

Unit.TestCase.prototype.assertNotEqual = function(expected, actual, message)
{
  var fullMessage = this.buildMessage(message, "<?> expected to be != to\n<?>.",
    actual, expected);
  this.assert(!this._equiv(expected, actual), fullMessage);
},

Unit.TestCase.prototype.assertSame = function(expected, actual, message)
{
  var fullMessage = this.buildMessage(message, "<?> expected but was\n<?>.",
    expected, actual);
  this.assert(expected === actual, fullMessage);
}

Unit.TestCase.prototype.assertNotSame = function(expected, actual, message)
{
  var fullMessage = this.buildMessage(message, "<?> expected to be != to\n<?>.",
    actual, expected);
  this.assert(expected !== actual, fullMessage);
}

Unit.TestCase.prototype.assertTrue = function(actual, message) {
  this.assertSame(true, actual, message);
}

Unit.TestCase.prototype.assertFalse = function(actual, message) {
  this.assertSame(false, actual, message);
}

Unit.TestCase.prototype.assertNull = function(actual, message) {
  this.assertSame(null, actual, message);
}

Unit.TestCase.prototype.assertNotNull = function(actual, message) {
  this.assertNotSame(null, actual, message);
}

Unit.TestCase.prototype.assertUndefined = function(actual, message) {
  this.assertSame(undefined, actual, message);
}

Unit.TestCase.prototype.assertNotUndefined = function(actual, message) {
  this.assertNotSame(undefined, actual, message);
}

Unit.TestCase.prototype.assertNaN = function(actual, message)
{
  var fullMessage = this.buildMessage(message, "<NaN> expected but was\n<?>.", actual);
  this.assert(Unit.AssertionMessage.getClassName(actual) == 'Number' &&
    actual.toString() == 'NaN', fullMessage);
}

Unit.TestCase.prototype.assertNotNaN = function(actual, message)
{
  var fullMessage = this.buildMessage(message, "<?> expected to be != to\n<NaN>.", actual);
  this.assert(!(Unit.AssertionMessage.getClassName(actual) == 'Number' &&
    actual.toString() == 'NaN'), fullMessage);
}

Unit.TestCase.prototype.assertThrow = function(exceptionName, func, message)
{
  var fullMessage;

  try
  {
    func();
    
    fullMessage = this.buildMessage(message, "<?> exception expected but none was thrown.",
      exceptionName);
  }
  catch(exception)
  {
    if (exception.name != exceptionName)
    {
      fullMessage = this.buildMessage(message, "<?> exception expected but was\n<?>.",
        exceptionName, exception.name);
    }
  }

  if (fullMessage) {
    this.assert(false, fullMessage);
  }
}

Unit.TestCase.prototype.assertNothingThrown = function(func, message)
{
  try {
    func();
  }
  catch(exception)
  {
    var fullMessage = this.buildMessage(message, "Exception raised:\n<?>.", exception.name);
    this.assert(false, fullMessage);
  }
}

Unit.TestCase.prototype.assertMatch = function(pattern, string, message)
{
  if (typeof pattern == 'string') {
    pattern = new RegExp(pattern);
  }
  var fullMessage = this.buildMessage(message,
    "<?> expected to match\n<?>.", string, pattern);
  this.assert(pattern.test(string), fullMessage);
}

Unit.TestCase.prototype.assertNoMatch = function(pattern, string, message)
{
  if (typeof pattern == 'string') {
    pattern = new RegExp(pattern);
  }
  var fullMessage = this.buildMessage(message,
    "<?> expected to not match\n<?>.", string, pattern);
  this.assert(!pattern.test(string), fullMessage);
}

Unit.TestCase.prototype.assertTypeOf = function(type, object, message)
{
  var fullMessage = this.buildMessage(message,
    "Expected to be of type\n<?> but was\n<?>.", type, typeof object);
  this.assert(typeof object == type, fullMessage);
}

Unit.TestCase.prototype.assertInstanceOf = function(klass, object, message)
{
  var fullMessage = this.buildMessage(message,
    "<?> expected to be an instance of\n<?>.", object, klass);
  this.assert(object instanceof klass, fullMessage);
}

Unit.TestCase.prototype.assertPrototypeOf = function(klass, object, message)
{
  var fullMessage = this.buildMessage(message,
    "<?> expected to be the prototype of\n<?>.",
    klass, object);
  this.assert(klass.prototype.isPrototypeOf(object), fullMessage);
}

Unit.TestCase.prototype.flunk = function(message) {
  this.assert(false, this.buildMessage(undefined, message || "Flunked."));
}

Unit.TestCase.prototype.buildMessage = function(header, template)
{
  var args = Array.prototype.slice.call(arguments, 2);
  return new Unit.AssertionMessage(header, template, args)
}

Unit.TestCase.prototype._equiv = function(a, b, strict)
{
  if (a instanceof Array) {
    if (!(b instanceof Array)) return false;
    return this._equivArrays(a, b, strict);
  }
  else if (typeof a == 'object' && a !== null && b !== null)
  {
    if (typeof b != 'object') return false;
    return this._equivObjects(a, b, strict);
  }
  else if (strict) {
    return a === b;
  }
  else {
    return a == b;
  }
}

Unit.TestCase.prototype._equivArrays = function(a, b, strict)
{
  if (a.length != b.length) {
    return false;
  }
  
  a.sort();
  b.sort();
  
  for (var i=0, len=a.length; i<len; i++)
  {
    if (!this._equiv(a[i], b[i], strict)) {
      return false;
    }
  }
  
  return true;
}

Unit.TestCase.prototype._equivObjects = function(a, b, strict)
{
  if (typeof a != typeof b || a.length != b.length) {
    return false;
  }
  
  for (var i in a)
  {
    if (!this._equiv(a[i], b[i], strict)) {
      return false;
    }
  }
  
  return true;
}

Unit.HtmlRunner = function() {}

Unit.HtmlRunner.run = function() {
  (new Unit.HtmlRunner()).run();
}

Unit.HtmlRunner.Error = function(className, testName, exception)
{ 
  this.type      = 'Error';
  this.className = className;
  this.testName  = testName;
  this.exception = exception;
}

Unit.HtmlRunner.Failure = function(className, testName, exception)
{
  this.type      = 'Failure';
  this.className = className;
  this.testName  = testName;
  this.exception = exception;
}

Unit.HtmlRunner.prototype = {
  run: function()
  {
    this.tests      = 0;
    this.assertions = 0;
    this.failures   = 0;
    this.errors     = 0;
    this.exceptions = [];
    
    this.console = document.createElement('p');
    this.console.className = 'console';
    this.table = document.createElement('table');
    document.body.appendChild(this.console);
    document.body.appendChild(this.table);
    
    Unit.TestCase.run(this);
  },

  // Called whenever a new test is run.
  testStart: function(className, testName)
  {
    var td, span;
    
    this.success = true;
    this.currentTest = {className: className, testName: testName};
    
    this.tr = document.createElement('tr');
    this.tr.className = 'running';
    
    td = document.createElement('td');
    td.appendChild(document.createTextNode(this.currentTest.className));
    this.tr.appendChild(td);
    
    td = document.createElement('td');
    td.appendChild(document.createTextNode(this.currentTest.testName));
    this.tr.appendChild(td);
    
    this.td = document.createElement('td');
    this.td.className = 'result';
    span = document.createElement('span');
    span.appendChild(document.createTextNode('running...'));
    this.td.appendChild(span);
    this.tr.appendChild(this.td);
    
    this.table.appendChild(this.tr);
  },

  // Called whenever a test has finished.
  testEnd: function()
  {
    if (this.success) {
      this.addSuccess();
    }
  },

  // Called when all the test suite has been runned.
  finished: function()
  {
    this.printExceptions();
    this.printResult();
  },

  addAssertion: function() {
    this.assertions++;
  },

  addSuccess: function()
  {
    this.tests++;
    this.print('.');
    this.debug('success');
  },

  addFailure: function(exception)
  {
    this.success = false;
    this.failures++;
    this.exceptions.push(new Unit.HtmlRunner.Failure(this.currentTest.className, this.currentTest.testName, exception));
    this.print('F');
    this.debug('failure', exception);
  },

  addError: function(exception)
  {
    this.success = false;
    this.errors++;
    this.exceptions.push(new Unit.HtmlRunner.Error(this.currentTest.className, this.currentTest.testName, exception));
    this.print('E');
    this.debug('error', exception);
  },

  // console-like debug (useful for IE6 which doesn't display the debug table).
  print: function(chr) {
    this.console.innerHTML += chr;
  },

  printExceptions: function()
  {
    this.print("<br/>");
    
    for (var i=0, len=this.exceptions.length; i<len; i++)
    {
      var e = this.exceptions[i];
      
      this.print("<br/>" +
        '<span class="' + (e.type == 'Error' ? 'error' : 'failure') + '">' +
        (parseInt(i) + 1) + ") " + e.testName + "(" + e.className + ")<br/>" +
        e.type + ": " + this.escapeHTML(e.exception.message.toString()) +
        '</span><br/>'
      );
    }
  },

  printResult: function()
  {
    this.print('<br/><span class="result">' +
      this.tests + " tests, " +
      this.assertions + " assertions, " +
      this.failures + " failures, " +
      this.errors + " errors." +
      '</span>'
    );
  },

  debug: function(type, exception)
  {
    this.tr.className = type;
    this.td.innerHTML = type;
    
    if (type != 'success')
    {
      tr = document.createElement('tr');
      tr.className = type + ' message';
      
      td = document.createElement('td');
      td.setAttribute('colspan', 3);
      //td.innerHTML = this.escapeHTML(exception.message.toString());
      td.appendChild(document.createTextNode(exception.message.toString()));
      tr.appendChild(td);
      
      this.table.appendChild(tr);
    }
  },
  
  escapeHTML: function(str) {
    return str.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
  }
}
