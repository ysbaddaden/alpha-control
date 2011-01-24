new Unit.TestCase('UI.ModalDialogTest',
{
  setup: function() {
    this.dialog = new UI.ModalDialog();
  },

  teardown: function() {
    this.dialog.destroy();
  },

  test_initModalDialog: function()
  {
    this.dialog.initModalDialog();
    this.assertTypeOf('object', this.dialog.getTitle());
  },

  test_initModalDialog_without_titlebar: function()
  {
    this.dialog.initModalDialog({titlebar: false});
    this.assertUndefined(this.dialog.getTitle());
  },

  test_show_and_displayed: function()
  {
    this.dialog.initModalDialog();
    this.assertFalse(this.dialog.displayed());
    this.assertFalse(this.dialog.overlay.displayed());
    
    this.dialog.show();
    this.assertTrue(this.dialog.displayed());
    this.assertTrue(this.dialog.overlay.displayed());
    
    this.dialog.hide();
    this.assertFalse(this.dialog.displayed());
    this.assertFalse(this.dialog.overlay.displayed());
  },

  test_default_position: function()
  {
    this.dialog.initModalDialog();
    this.dialog.show();
    this.assertNotEqual('', this.dialog.container.style.top);
    this.assertNotEqual('', this.dialog.container.style.left);
  },

  test_top_position: function()
  {
    this.dialog.initModalDialog({position: 'top'});
    this.dialog.show();
    this.assertEqual('0px', this.dialog.container.style.top);
    this.assertNotEqual('', this.dialog.container.style.left);
    this.assertEqual('',    this.dialog.container.style.bottom);
    this.assertEqual('',    this.dialog.container.style.right);
  },

  test_right_position: function()
  {
    this.dialog.initModalDialog({position: 'right'});
    this.dialog.show();
    this.assertNotEqual('', this.dialog.container.style.top);
    this.assertEqual('0px', this.dialog.container.style.right);
    this.assertEqual('',    this.dialog.container.style.bottom);
    this.assertEqual('',    this.dialog.container.style.left);
  },

  test_bottom_position: function()
  {
    this.dialog.initModalDialog({position: 'bottom'});
    this.dialog.show();
    this.assertEqual('',    this.dialog.container.style.top);
    this.assertEqual('',    this.dialog.container.style.right);
    this.assertEqual('0px', this.dialog.container.style.bottom);
    this.assertNotEqual('', this.dialog.container.style.left);
  },

  test_left_position: function()
  {
    this.dialog.initModalDialog({position: 'left'});
    this.dialog.show();
    this.assertNotEqual('', this.dialog.container.style.top);
    this.assertEqual('',    this.dialog.container.style.right);
    this.assertEqual('',    this.dialog.container.style.bottom);
    this.assertEqual('0px', this.dialog.container.style.left);
  }
});
