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

  test_prototype: function() {
    this.assertPrototypeOf(UI.Widget, this.picker);
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
    this.assertEqual(this.input.offsetTop + this.input.offsetHeight + 'px', this.picker.container.style.top);
    this.assertEqual(this.input.offsetLeft  + 'px', this.picker.container.style.left);
    this.assertEqual(this.input.offsetWidth + 'px', this.picker.container.style.minWidth);
  },

  test_setPosition_top: function()
  {
    this.picker.initPicker(this.input, {position: 'top'});
    this.picker.show();
    this.assertEqual('picker top', this.picker.container.className);
    this.assertEqual(this.input.offsetTop - this.picker.container.offsetHeight + 'px', this.picker.container.style.top);
    this.assertNotEqual('', this.picker.container.style.left);
    this.assertEqual('', this.picker.container.style.minWidth);
  },

  test_setPosition_bottom: function()
  {
    this.picker.initPicker(this.input, {position: 'bottom'});
    this.picker.show();
    this.assertEqual('picker bottom', this.picker.container.className);
    this.assertEqual(this.input.offsetTop + this.input.offsetHeight + 'px', this.picker.container.style.top);
    this.assertNotEqual('', this.picker.container.style.left);
    this.assertEqual('', this.picker.container.style.minWidth);
  },

  test_setPosition_left: function()
  {
    this.picker.initPicker(this.input, {position: 'left'});
    this.picker.show();
    this.assertEqual('picker left', this.picker.container.className);
    this.assertNotEqual('', this.picker.container.style.top);
    this.assertEqual(this.input.offsetLeft - this.picker.container.offsetWidth + 'px', this.picker.container.style.left);
    this.assertEqual('', this.picker.container.style.minWidth);
  },

  test_setPosition_right: function()
  {
    this.picker.initPicker(this.input, {position: 'right'});
    this.picker.show();
    this.assertEqual('picker right', this.picker.container.className);
    this.assertNotEqual('', this.picker.container.style.top);
    this.assertEqual(this.input.offsetLeft + this.input.offsetWidth + 'px', this.picker.container.style.left);
    this.assertEqual('', this.picker.container.style.minWidth);
  },

  test_setPosition_top_left: function()
  {
    this.picker.initPicker(this.input, {position: 'top left'});
    this.picker.show();
    this.assertEqual('picker top-left', this.picker.container.className);
    this.assertEqual('', this.picker.container.style.minWidth);
    this.assertEqual(this.input.offsetTop - this.picker.container.offsetHeight + 'px', this.picker.container.style.top);
    this.assertEqual(this.input.offsetLeft - this.picker.container.offsetWidth + 'px', this.picker.container.style.left);
  },

  test_setPosition_top_right : function()
  {
    this.picker.initPicker(this.input, {position: 'top right'});
    this.picker.show();
    this.assertEqual('picker top-right', this.picker.container.className);
    this.assertEqual('', this.picker.container.style.minWidth);
    this.assertEqual(this.input.offsetTop - this.picker.container.offsetHeight + 'px', this.picker.container.style.top);
    this.assertEqual(this.input.offsetLeft + this.input.offsetWidth + 'px', this.picker.container.style.left);
  },

  test_setPosition_bottom_left: function()
  {
    this.picker.initPicker(this.input, {position: 'bottom left'});
    this.picker.show();
    this.assertEqual('picker bottom-left', this.picker.container.className);
    this.assertEqual('', this.picker.container.style.minWidth);
    this.assertEqual(this.input.offsetTop + this.input.offsetHeight + 'px', this.picker.container.style.top);
    this.assertEqual(this.input.offsetLeft - this.picker.container.offsetWidth + 'px', this.picker.container.style.left);
  },

  test_setPosition_bottom_right : function()
  {
    this.picker.initPicker(this.input, {position: 'bottom right'});
    this.picker.show();
    this.assertEqual('picker bottom-right', this.picker.container.className);
    this.assertEqual('', this.picker.container.style.minWidth);
    this.assertEqual(this.input.offsetTop + this.input.offsetHeight + 'px', this.picker.container.style.top);
    this.assertEqual(this.input.offsetLeft + this.input.offsetWidth + 'px', this.picker.container.style.left);
  }
});
