new Unit.TestCase('ElementTest',
{
  setup: function()
  {
    this.node = document.createElement('div'); document.body.appendChild(this.node);
    this.node.className = 'abc jkl def-ghi';
    this.node.style.position = 'absolute';
    this.node.style.top      = '20px';
    this.node.style.left     = '50px';
    
    this.childA = document.createElement('span'); this.node.appendChild(this.childA);
    this.childB = document.createElement('span'); this.node.appendChild(this.childB);
    this.childC = document.createElement('span'); this.node.appendChild(this.childC);
    this.childC.style.display  = 'block';
    this.childC.style.position = 'absolute';
    this.childC.style.top      = '30px';
    this.childC.style.left     = '10px';
  },

  teardown: function() {
    document.body.removeChild(this.node);
  },

  test_insertAfter_first_node: function()
  {
    var elm = document.createElement('span');
    this.node.insertAfter(elm, this.childA);
    this.assertSame(this.childA, elm.previousSibling);
    this.assertSame(this.childB, elm.nextSibling);
  },

  test_insertAfter_last_node: function()
  {
    var elm = document.createElement('span');
    this.node.insertAfter(elm, this.childC);
    this.assertSame(this.childC, elm.previousSibling);
    this.assertNull(elm.nextSibling);
  },

  test_insertAfter: function()
  {
    var elm = document.createElement('span');
    this.node.insertAfter(elm, this.childB);
    this.assertSame(this.childB, elm.previousSibling);
    this.assertSame(this.childC, elm.nextSibling);
  },

  test_getPosition: function()
  {
    var pos = this.childC.getPosition();
    this.assertEqual(50, pos.top);
    this.assertEqual(60, pos.left);
  },

  test_hasClassName: function()
  {
    this.assertTrue(this.node.hasClassName('abc'));
    this.assertTrue(this.node.hasClassName('jkl'));
    this.assertTrue(this.node.hasClassName('def-ghi'));
    this.assertFalse(this.node.hasClassName('def'));
    this.assertFalse(this.node.hasClassName('ghi'));
  },

  test_addClassName: function()
  {
    this.node.addClassName('ghi');
    this.node.addClassName('tyu');
    this.assertTrue(this.node.hasClassName('ghi'));
    this.assertTrue(this.node.hasClassName('tyu'));
    this.assertTrue(this.node.hasClassName('def-ghi'));
  },

  test_removeClassName: function()
  {
    this.node.removeClassName('abc');
    this.node.removeClassName('def-ghi');
    this.assertFalse(this.node.hasClassName('abc'));
    this.assertTrue(this.node.hasClassName('jkl'));
    this.assertFalse(this.node.hasClassName('def-ghi'));
  },

  test_toggleClassName: function()
  {
    this.node.toggleClassName('abc');
    this.assertFalse(this.node.hasClassName('abc'));
    
    this.node.toggleClassName('tyu');
    this.node.toggleClassName('abc');
    this.assertTrue(this.node.hasClassName('tyu'));
    this.assertTrue(this.node.hasClassName('abc'));
    
    this.node.toggleClassName('tyu');
    this.assertFalse(this.node.hasClassName('tyu'));
  },

  test_findParentNode: function()
  {
    this.assertSame(this.childC, this.childC.findParentNode('span'));
    this.assertSame(this.node, this.childC.findParentNode('div'));
    this.assertSame(document.body, this.childC.findParentNode('body'));
  }
});
