new Unit.TestCase('UI.Notification',
{
  setup: function() {
    this.notification = new UI.Notification();
  },

  teardown: function() {
    this.notification.destroy();
  },

  test_prototype: function() {
    this.assertPrototypeOf(UI.Widget, this.notification);
  },

  test_initNotification: function()
  {
    this.notification.initNotification();
    this.assertEqual(2500, this.notification.options.timeout);
    
    this.notification.initNotification({timeout: 500});
    this.assertEqual(500, this.notification.options.timeout);
  },

  test_setMessage_with_text: function()
  {
    var text = "my text message";
    this.notification = new UI.Notification();
    this.notification.initNotification({timeout: 100});
    
    this.notification.setMessage(text);
    this.assertTrue(this.notification.displayed());
    this.assertEqual(text, this.notification.getMessage().toLowerCase());
    
    this.async();
    setTimeout(function()
    {
      this.sync(function() {
        this.assertFalse(this.notification.displayed());
      });
    }.bind(this), 100)
  },

  test_setMessage_with_html_and_timeout: function()
  {
    var html = '<p>my <strong>html</strong> message</p>';
    this.notification = new UI.Notification();
    this.notification.initNotification();
    
    this.notification.setMessage(html, 120);
    this.assertTrue(this.notification.displayed());
    this.assertEqual(html, this.notification.getMessage().toLowerCase());
    
    this.async();
    setTimeout(function()
    {
      this.sync(function() {
        this.assertFalse(this.notification.displayed());
      });
    }.bind(this), 120);
  }
});
