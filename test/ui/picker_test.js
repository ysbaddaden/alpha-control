new Unit.TestCase('UI.PickerTest',
{
  setup: function()
  {
    this.picker = new UI.Picker();
    
    this.div = document.createElement('div');
    document.body.appendChild(this.div);
    
    this.input = document.createElement('input');
    this.div.appendChild(this.input);
    
    this.picker.initPicker(this.input);
  },

  teardown: function()
  {
    this.picker.destroy();
    document.body.removeChild(this.div);
  },

  test_initPicker: function()
  {
    this.assertThrow('TypeError', function() {
      this.picker.initPicker();
    }.bind(this));
    
    this.picker.initPicker(this.input);
    
    this.assertNothingThrown(function() {
      this.picker.initPicker(this.input);
    }.bind(this));
  },

  test_attachToDOM: function()
  {
    this.picker.attachToDOM();
    this.assert(this.picker.container.parentNode === this.div,
      "Expected widget to be appended to div.");
  },

  test_setPosition_default: function()
  {
    this.picker.show();
    this.assertNotEqual('', this.picker.container.style.top);
    this.assertNotEqual('', this.picker.container.style.left);
    this.assertNotEqual('', this.picker.container.style.minWidth);
  },

  test_setPosition_array: function() {
  }
});
