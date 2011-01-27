new Unit.TestCase('UI.OverlayTest',
{
  setup: function() {
    this.overlay = new UI.Overlay();
  },

  teardown: function() {
    this.overlay.destroy();
  },

  test_prototype: function() {
    this.assertPrototypeOf(UI.Widget, this.overlay);
  },

  test_initOverlay: function()
  {
    this.overlay.initOverlay();
    this.assertTypeOf('object', this.overlay.content);
  }
});
