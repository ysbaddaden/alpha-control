new Unit.TestCase('ColorTest',
{
  test_hex: function()
  {
    var color = new Alpha.Color('#000000');
    this.assertEqual(0, color.r);
    this.assertEqual(0, color.g);
    this.assertEqual(0, color.b);
    this.assertEqual(1.0, color.a);
    this.assertEqual("rgb(0, 0, 0)", color.toRGB());
    this.assertEqual("rgba(0, 0, 0, 1)", color.toRGBA());
    this.assertEqual("rgba(0, 0, 0, 0.5)", color.toRGBA(0.5));
    this.assertEqual("hsl(0, 0%, 0%)", color.toHSL());
    this.assertEqual("hsla(0, 0%, 0%, 0.5)", color.toHSLA(0.5));
    this.assertEqual("#000000", color.toHex());
    
    var color = new Alpha.Color('#ABC');
    this.assertEqual(170, color.r);
    this.assertEqual(187, color.g);
    this.assertEqual(204, color.b);
    this.assertEqual(1.0, color.a);
    this.assertEqual("rgb(170, 187, 204)", color.toRGB());
    this.assertEqual("rgba(170, 187, 204, 1)", color.toRGBA());
    this.assertEqual("hsl(210, 17%, 73%)", color.toHSL());
    this.assertEqual("hsla(210, 17%, 73%, 1)", color.toHSLA());
    this.assertEqual("#AABBCC", color.toHex());
    
    var color = new Alpha.Color('#FF88DD');
    this.assertEqual(255, color.r);
    this.assertEqual(136, color.g);
    this.assertEqual(221, color.b);
    this.assertEqual(1.0, color.a);
    this.assertEqual("rgb(255, 136, 221)", color.toRGB());
    this.assertEqual("rgba(255, 136, 221, 1)", color.toRGBA());
    this.assertEqual("hsl(317, 47%, 77%)", color.toHSL());
    this.assertEqual("hsla(317, 47%, 77%, 1)", color.toHSLA());
    this.assertEqual("#FF88DD", color.toHex());
    
    var color = new Alpha.Color('  #FF00DD ');
    this.assertEqual(255, color.r);
    this.assertEqual(0, color.g);
    this.assertEqual(221, color.b);
    this.assertEqual(1.0, color.a);
    this.assertEqual("rgb(255, 0, 221)", color.toRGB());
    this.assertEqual("rgba(255, 0, 221, 1)", color.toRGBA());
    this.assertEqual("hsl(308, 100%, 50%)", color.toHSL());
    this.assertEqual("hsla(308, 100%, 50%, 1)", color.toHSLA());
    this.assertEqual("#FF00DD", color.toHex());
    
    this.assertThrow('Error', function() { new Alpha.Color("") });
    this.assertThrow('Error', function() { new Alpha.Color("#0") });
    this.assertThrow('Error', function() { new Alpha.Color("#1234") });
  },

  test_rgb: function()
  {
    var color = new Alpha.Color("rgb(0, 0,0)");
    this.assertEqual(0, color.r);
    this.assertEqual(0, color.g);
    this.assertEqual(0, color.b);
    this.assertEqual(1.0, color.a);
    this.assertEqual("rgb(0, 0, 0)", color.toRGB());
    this.assertEqual("rgba(0, 0, 0, 1)", color.toRGBA());
    this.assertEqual("rgba(0, 0, 0, 0.25)", color.toRGBA(0.25));
    this.assertEqual("hsl(0, 0%, 0%)", color.toHSL());
    this.assertEqual("hsla(0, 0%, 0%, 1)", color.toHSLA());
    this.assertEqual("#000000", color.toHex());
    
    var color = new Alpha.Color("rgb(128, 130,5)");
    this.assertEqual(128, color.r);
    this.assertEqual(130, color.g);
    this.assertEqual(5, color.b);
    this.assertEqual(1.0, color.a);
    this.assertEqual("rgb(128, 130, 5)", color.toRGB());
    this.assertEqual("rgba(128, 130, 5, 1)", color.toRGBA());
    this.assertEqual("hsl(61, 96%, 26%)", color.toHSL());
    this.assertEqual("hsla(61, 96%, 26%, 1)", color.toHSLA());
    this.assertEqual("#808205", color.toHex());
    
    this.assertThrow('Error', function() { new Alpha.Color("rgb(0,2)") });
  },

  test_rgba: function()
  {
    var color = new Alpha.Color("rgba(0, 0,0, 0.8)");
    this.assertEqual(0, color.r);
    this.assertEqual(0, color.g);
    this.assertEqual(0, color.b);
    this.assertEqual(0.8, color.a);
    this.assertEqual("rgb(0, 0, 0)", color.toRGB());
    this.assertEqual("rgba(0, 0, 0, 0.8)", color.toRGBA());
    this.assertEqual("hsl(0, 0%, 0%)", color.toHSL());
    this.assertEqual("hsla(0, 0%, 0%, 0.8)", color.toHSLA());
    this.assertEqual("#000000", color.toHex());
    
    var color = new Alpha.Color("rgba(128, 130,12, 0.1)");
    this.assertEqual(128, color.r);
    this.assertEqual(130, color.g);
    this.assertEqual(12, color.b);
    this.assertEqual(0.1, color.a);
    this.assertEqual("rgb(128, 130, 12)", color.toRGB());
    this.assertEqual("rgba(128, 130, 12, 0.1)", color.toRGBA());
    this.assertEqual("hsl(61, 91%, 28%)", color.toHSL());
    this.assertEqual("hsla(61, 91%, 28%, 0.1)", color.toHSLA());
    this.assertEqual("#80820C", color.toHex());
    
    var color = new Alpha.Color("rgba(128,130,12)");
    this.assertEqual(128, color.r);
    this.assertEqual(130, color.g);
    this.assertEqual(12, color.b);
    this.assertEqual(1.0, color.a);
    this.assertEqual("rgb(128, 130, 12)", color.toRGB());
    this.assertEqual("rgba(128, 130, 12, 1)", color.toRGBA());
    this.assertEqual("hsl(61, 91%, 28%)", color.toHSL());
    this.assertEqual("hsla(61, 91%, 28%, 1)", color.toHSLA());
    this.assertEqual("#80820C", color.toHex());
  },

  test_array: function()
  {
    var color = new Alpha.Color([0, 0, 0]);
    this.assertEqual(0, color.r);
    this.assertEqual(0, color.g);
    this.assertEqual(0, color.b);
    this.assertEqual(1, color.a);
    this.assertEqual("rgb(0, 0, 0)", color.toRGB());
    this.assertEqual("rgba(0, 0, 0, 1)", color.toRGBA());
    this.assertEqual("#000000", color.toHex());
    
    var color = new Alpha.Color([0, 12, 13, 0.5]);
    this.assertEqual(0, color.r);
    this.assertEqual(12, color.g);
    this.assertEqual(13, color.b);
    this.assertEqual(0.5, color.a);
    this.assertEqual("rgb(0, 12, 13)", color.toRGB());
    this.assertEqual("rgba(0, 12, 13, 0.5)", color.toRGBA());
    this.assertEqual("#000C0D", color.toHex());
    
    this.assertThrow('Error', function() { new Alpha.Color([0,1]) });
    this.assertThrow('Error', function() { new Alpha.Color([0,1,2,3,4]) });
  },

  test_object: function()
  {
    var color = new Alpha.Color({r: 0, g: 0, b: 0});
    this.assertEqual(0, color.r);
    this.assertEqual(0, color.g);
    this.assertEqual(0, color.b);
    this.assertEqual(1, color.a);
    this.assertEqual("rgb(0, 0, 0)", color.toRGB());
    this.assertEqual("rgba(0, 0, 0, 1)", color.toRGBA());
    this.assertEqual("#000000", color.toHex());
    
    var color = new Alpha.Color({r: 0, g: 12, b: 13, a: 0.9});
    this.assertEqual(0, color.r);
    this.assertEqual(12, color.g);
    this.assertEqual(13, color.b);
    this.assertEqual(0.9, color.a);
    this.assertEqual("rgb(0, 12, 13)", color.toRGB());
    this.assertEqual("rgba(0, 12, 13, 0.9)", color.toRGBA());
    this.assertEqual("#000C0D", color.toHex());
    
    this.assertThrow('Error', function() { new Alpha.Color({}) });
  }
});
