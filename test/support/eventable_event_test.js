new Unit.TestCase('Eventable.EventTest',
{
  test_new: function()
  {
    var event = new Eventable.Event();
    event.initEvent('click', true);
    this.assertEqual('click', event.type);
    this.assertTrue(event.cancelable);
    this.assertNull(event.defaultPrevented);
    this.assertNull(event.propagationStopped);
  },

  test_cancelable: function()
  {
    var event = new Eventable.Event();
    event.initEvent('click', false);
    this.assertFalse(event.cancelable);
    this.assertNull(event.defaultPrevented);
    
    event.preventDefault();
    this.assertNull(event.defaultPrevented);
  },

  test_not_cancelable: function()
  {
    var event = new Eventable.Event();
    event.initEvent('click', true);
    this.assertTrue(event.cancelable);
    this.assertNull(event.defaultPrevented);
    
    event.preventDefault();
    this.assertTrue(event.defaultPrevented);
  },

  test_stopPropagation: function()
  {
    var event = new Eventable.Event();
    event.initEvent('click', false);
    this.assertFalse(event.cancelable);
    this.assertNull(event.propagationStopped);
    
    event.stopPropagation();
    this.assertTrue(event.propagationStopped);
  }
});
