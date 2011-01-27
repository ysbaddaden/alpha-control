new Unit.TestCase('UI.DialogTest',
{
  setup: function() {
    this.dialog = new UI.Dialog();
  },

  teardown: function() {
    this.dialog.destroy();
  },

  test_prototype: function() {
    this.assertPrototypeOf(UI.Widget, this.dialog);
  },

  test_initDialog: function()
  {
    this.dialog.initDialog();
    this.assertTypeOf('object', this.dialog.getTitle());
  },

  test_initDialog_without_titlebar: function()
  {
    this.dialog.initDialog({titlebar: false});
    this.assertUndefined(this.dialog.getTitle());
  },

  test_show_and_displayed: function()
  {
    this.dialog.initDialog();
    this.assertFalse(this.dialog.displayed());
    this.dialog.show();
    this.assertTrue(this.dialog.displayed());
    this.dialog.hide();
    this.assertFalse(this.dialog.displayed());
  },

  test_default_position: function()
  {
    this.dialog.initDialog();
    this.dialog.show();
    this.assertNotEqual('', this.dialog.container.style.top);
    this.assertNotEqual('', this.dialog.container.style.left);
  },

  test_top_position: function()
  {
    this.dialog.initDialog({position: 'top'});
    this.dialog.show();
    this.assertEqual('0px', this.dialog.container.style.top);
    this.assertNotEqual('', this.dialog.container.style.left);
    this.assertEqual('',    this.dialog.container.style.bottom);
    this.assertEqual('',    this.dialog.container.style.right);
  },

  test_right_position: function()
  {
    this.dialog.initDialog({position: 'right'});
    this.dialog.show();
    this.assertNotEqual('', this.dialog.container.style.top);
    this.assertEqual('0px', this.dialog.container.style.right);
    this.assertEqual('',    this.dialog.container.style.bottom);
    this.assertEqual('',    this.dialog.container.style.left);
  },

  test_bottom_position: function()
  {
    this.dialog.initDialog({position: 'bottom'});
    this.dialog.show();
    this.assertEqual('',    this.dialog.container.style.top);
    this.assertEqual('',    this.dialog.container.style.right);
    this.assertEqual('0px', this.dialog.container.style.bottom);
    this.assertNotEqual('', this.dialog.container.style.left);
  },

  test_left_position: function()
  {
    this.dialog.initDialog({position: 'left'});
    this.dialog.show();
    this.assertNotEqual('', this.dialog.container.style.top);
    this.assertEqual('',    this.dialog.container.style.right);
    this.assertEqual('',    this.dialog.container.style.bottom);
    this.assertEqual('0px', this.dialog.container.style.left);
  }
});
