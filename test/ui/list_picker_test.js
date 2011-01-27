new Unit.TestCase('UI.ListPickerTest',
{
  setup: function()
  {
    this.picker = new UI.ListPicker();
    
    this.div = document.createElement('div');
    document.body.appendChild(this.div);
    
    this.input = document.createElement('input');
    this.div.appendChild(this.input);
    
    this.picker.initListPicker(this.input);
  },

  teardown: function()
  {
    this.picker.destroy();
    document.body.removeChild(this.div);
  },

  test_prototype: function()
  {
    this.assertPrototypeOf(UI.Picker, this.picker);
    this.assertPrototypeOf(UI.Widget, this.picker);
  },

  test_initListPicker: function()
  {
    this.picker.initListPicker(this.input);
    this.assertFalse(this.picker.options.autoMarkFirst);
    
    this.picker.initListPicker(this.input, {autoMarkFirst: true});
    this.assertTrue(this.picker.options.autoMarkFirst);
    
    this.assertNotUndefined(this.picker.relativeElement);
    this.assertNotUndefined(this.picker.list);
    this.assertSame(this.picker.getContent().firstChild, this.picker.list);
  },

  test_items_as_html: function()
  {
    this.assertFalse(this.picker.hasItems());
    this.picker.setItems('<li>ABC</li>\n  <li>DEF</li>');
    this.assertTrue(this.picker.hasItems());
    
    items = this.picker.getItems();
    this.assertEqual(2, items.length);
    this.assertEqual('li', items[0].tagName.toLowerCase());
    
    this.assertEqual('li',  this.picker.getItem(0).tagName.toLowerCase());
    this.assertEqual('ABC', this.picker.getItem(0).innerText);
    this.assertEqual('DEF', this.picker.getItem(1).innerText);
  },

  test_items_as_collection: function()
  {
    var coll = [], li;
    
    li = document.createElement('li');
    li.innerText = 'ABC';
    coll.push(li);
    
    li = document.createElement('li');
    li.innerText = 'DEF';
    coll.push(li);
    
    this.assertFalse(this.picker.hasItems());
    this.picker.setItems(coll);
    this.assertTrue(this.picker.hasItems());
    
    items = this.picker.getItems();
    this.assertEqual(2, items.length);
    this.assertEqual('li', items[0].tagName.toLowerCase());
    
    this.assertEqual('li',  this.picker.getItem(0).tagName.toLowerCase());
    this.assertEqual('ABC', this.picker.getItem(0).innerText);
    this.assertEqual('DEF', this.picker.getItem(1).innerText);
  },

  test_items_as_fragment: function()
  {
    var fragment = document.createDocumentFragment(), li;
    
    li = document.createElement('li');
    li.innerText = 'ABC';
    fragment.appendChild(li);
    
    li = document.createElement('li');
    li.innerText = 'DEF';
    fragment.appendChild(li);
    
    this.assertFalse(this.picker.hasItems());
    this.picker.setItems(fragment);
    this.assertTrue(this.picker.hasItems());
    
    items = this.picker.getItems();
    this.assertEqual(2, items.length);
    this.assertEqual('li', items[0].tagName.toLowerCase());
    
    this.assertEqual('li',  this.picker.getItem(0).tagName.toLowerCase());
    this.assertEqual('ABC', this.picker.getItem(0).innerText);
    this.assertEqual('DEF', this.picker.getItem(1).innerText);
  },

  test_autoMarkFirst_option: function()
  {
    this.picker.initListPicker(this.input);
    this.picker.setItems('<li>abcd</li><li>def</li><li>ghi</li>');
    this.assertFalse(this.picker.getItem(0).hasClassName('selected'));
    
    this.picker.initListPicker(this.input, {autoMarkFirst: true});
    this.picker.setItems('<li>abcd</li><li>def</li><li>ghi</li>');
    this.assertTrue(this.picker.getItem(0).hasClassName('selected'));
  },

  test_moveSelection: function()
  {
    this.picker.initListPicker(this.input);
    this.picker.setItems('<li>abcd</li><li>def</li><li>ghi</li>');
    
    this.picker.moveSelectionDown();
    this.assertTrue(this.picker.getItem(0).hasClassName('selected'), "should select the first item");
    
    this.picker.moveSelectionDown();
    this.assertFalse(this.picker.getItem(0).hasClassName('selected'), "should have unselected the first item");
    this.assertTrue(this.picker.getItem(1).hasClassName('selected'), "should select the second item");
    
    this.picker.moveSelectionUp();
    this.picker.moveSelectionUp();
    this.assertFalse(this.picker.getItem(1).hasClassName('selected'), "should have unselected the 2nd item");
    this.assertTrue(this.picker.getItem(0).hasClassName('selected'), "should select the 1st item");

    this.picker.moveSelectionDown();
    this.picker.moveSelectionDown();
    this.picker.moveSelectionDown();
    this.picker.moveSelectionDown();
    this.assertTrue(this.picker.getItem(2).hasClassName('selected'), "should select the last item");
  },

  test_moveSelection_with_autoMarkFirst: function()
  {
    this.picker.initListPicker(this.input, {autoMarkFirst: true});
    this.picker.setItems('<li>abcd</li><li>def</li><li>ghi</li>');
    
    this.picker.moveSelectionDown();
    this.assertFalse(this.picker.getItem(0).hasClassName('selected'), "should unselect the first item");
    this.assertTrue(this.picker.getItem(1).hasClassName('selected'), "should select the second item");
  },

  test_selectSelection: function()
  {
    this.picker.initListPicker(this.input, {autoMarkFirst: true});
    this.picker.setItems('<li>abcd</li><li>def</li><li>ghi</li>');
    this.picker.selectSelection();
    this.assertFalse(this.picker.getItem(0).hasClassName('selected'), "should unselect the first item");
  }
});
