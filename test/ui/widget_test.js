new Unit.TestCase('UI.WidgetTest',
{
  setup: function()
  {
    this.widget = new UI.Widget();
    this.widget.initWidget();
  },

  teardown: function() {
    this.widget.destroy();
  },

  test_new: function() {
    this.assertTypeOf('function', this.widget.initWidget);
  },

  test_initWidget: function()
  {
    this.widget.initWidget();
    this.assertTypeOf('object', this.widget.container);
    this.assertTypeOf('object', this.widget.content);
    this.assertEqual('', this.widget.container.id);
    this.assertEqual('', this.widget.container.className);
  },

  test_initWidget_with_options: function()
  {
    this.widget.initWidget({className: 'mywidget', id: 'myid'});
    this.assertEqual('myid',     this.widget.container.id);
    this.assertEqual('mywidget', this.widget.container.className);
  },

  test_setContent_and_getContent: function()
  {
    var html = "<span>toto</span>";
    this.widget.setContent(html);
    this.assertEqual(html, this.widget.getContent().innerHTML.toLowerCase());
    
    var span = document.createElement('span');
    this.widget.setContent(span);
    this.assert(span == this.widget.getContent().getElementsByTagName('span').item(0));
  },

  test_displayed: function()
  {
    this.assertFalse(this.widget.displayed());
    
    this.widget.show();
    this.assertTrue(this.widget.displayed());
    
    this.widget.hide();
    this.assertFalse(this.widget.displayed());
  },

  test_destroy: function()
  {
    this.widget.destroy();
    this.assertUndefined(this.widget.getContent());
    this.assertUndefined(this.widget.container);
  },

  test_hide_onClose_option: function()
  {
    this.widget.initWidget({onClose: 'hide'});
    this.widget.show();
    this.widget.close();
    this.assertTypeOf('object', this.widget.getContent());
    this.assertTypeOf('object', this.widget.container);
    this.assertTrue(this.widget.attached());
    this.assertFalse(this.widget.displayed());
  },

  test_destroy_onClose_option: function()
  {
    this.widget.initWidget({onClose: 'destroy'});
    this.widget.close();
    this.assertUndefined(this.widget.getContent());
    this.assertUndefined(this.widget.container);
    this.assertFalse(this.widget.attached());
    this.assertFalse(this.widget.displayed());
  },

  test_destroy_with_attached_widget: function()
  {
    var container = this.widget.container;
    
    this.widget.attachToDOM();
    this.widget.destroy();
    
    this.assertFalse(this.widget.attached());
    this.assertUndefined(this.widget.getContent());
    
    delete container;
  },

  test_setPosition: function()
  {
    this.widget.setPosition = function()
    {
      this.container.style.top  = '10px';
      this.container.style.left = '20px';
    }
    
    this.widget.show();
    this.assertEqual('10px', this.widget.container.style.top);
    this.assertEqual('20px', this.widget.container.style.left);
  }
});
