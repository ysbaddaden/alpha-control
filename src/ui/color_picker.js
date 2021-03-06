/*
// TODO: Test in all browsers (especially in IE with excanvas).
// TODO: Colorize input's background, choosing the right color for foreground: white or black.

UI.ColorPicker = function() {}
UI.ColorPicker.prototype = new UI.Picker();

UI.ColorPicker.prototype.initColorPicker = function(input, options)
{
  this.initPicker(input, options);
  this.input.addEventListener('click', this.show.bind(this), false);

  this.gradient  = this.newCanvas('gradient',  150, 150);
  this.crosshair = this.newCanvas('crosshair',  15,  15);
  this.hue       = this.newCanvas('hue',        15, 150);
  this.slider    = this.newCanvas('slider',     25,   5);

  this.preview = document.createElement('div');
  this.preview.className = 'preview';

  var gradient_wrapper = document.createElement('div');
  gradient_wrapper.className = 'gradient-wrapper';
  gradient_wrapper.append(this.gradient);
  gradient_wrapper.append(this.crosshair);

  var hue_wrapper = document.createElement('div');
  hue_wrapper.className = 'hue-wrapper';
  hue_wrapper.append(this.hue);
  hue_wrapper.append(this.slider);

  this.content.append(gradient_wrapper);
  this.content.append(hue_wrapper);
  this.content.append(this.preview);

  // values
  // TODO: Move data to options.
  this.data = {
    x: this.gradient.getAttribute('width'),
    y: this.gradient.getAttribute('height'),
    base: {
      r: 255,
      g: 0,
      b: 0
    },
    gradient_w: this.gradient.getAttribute('width'),
    gradient_h: this.gradient.getAttribute('height'),
    hue_w: this.hue.getAttribute('width'),
    hue_h: this.hue.getAttribute('height')
  };

  // the big gradient
  var ctx = this.gradient.getContext('2d');

  var grad_white = ctx.createLinearGradient(0, 0, this.data.gradient_w, 0);
  grad_white.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad_white.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = grad_white;
  ctx.fillRect(0, 0, this.data.gradient_w, this.data.gradient_h);

  var grad_black = ctx.createLinearGradient(0, 0, 0, this.data.gradient_h);
  grad_black.addColorStop(1, 'rgba(0, 0, 0, 1.0)');
  grad_black.addColorStop(0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad_black;
  ctx.fillRect(0, 0, this.data.gradient_w, this.data.gradient_h);

  // the small gradient
  var ctx = this.hue.getContext('2d');

  var grad = ctx.createLinearGradient(0, 0, 0, this.data.hue_h);
  var section = 1.0 / 6;
  grad.addColorStop(0.0,         'rgba(255,   0,   0, 1.0)');
  grad.addColorStop(section * 1, 'rgba(255, 255,   0, 1.0)');
  grad.addColorStop(section * 2, 'rgba(0,   255,   0, 1.0)');
  grad.addColorStop(section * 3, 'rgba(0,   255, 255, 1.0)');
  grad.addColorStop(section * 4, 'rgba(0,     0, 255, 1.0)');
  grad.addColorStop(section * 5, 'rgba(255,   0, 255, 1.0)');
  grad.addColorStop(1.0,         'rgba(255,   0,   0, 1.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, this.data.hue_w, this.data.hue_h);

  // the crosshair
  var ctx         = this.crosshair.getContext('2d');
  ctx.lineWidth   = 1;
  ctx.lineCap     = 'butt';
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(7.5, 0); ctx.lineTo(7.5, 7); ctx.moveTo(7.5, 8); ctx.lineTo(7.5, 15);
  ctx.moveTo(0, 7.5); ctx.lineTo(7, 7.5); ctx.moveTo(8, 7.5); ctx.lineTo(15, 7.5);
  ctx.stroke();

  // the slider
  var ctx       = this.slider.getContext('2d');
  ctx.lineWidth = 1;
  ctx.lineCap   = 'round';
  ctx.lineJoin  = 'round';
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(0, 0);  ctx.lineTo(5, 2.5);  ctx.lineTo(0, 5);  ctx.lineTo(0, 0);
  ctx.moveTo(25, 0); ctx.lineTo(20, 2.5); ctx.lineTo(25, 5); ctx.lineTo(25, 0);
  ctx.fill();

  new UI.ColorPicker.Crosshair(this);
  new UI.ColorPicker.Slider(this);
}

UI.ColorPicker.prototype.newCanvas = function(className, width, height)
{
  var canvas = document.createElement('canvas');
  canvas.className = className;
  canvas.setAttribute('width',  width);
  canvas.setAttribute('height', height);
  return canvas;
}

// display

UI.ColorPicker.prototype.show = function()
{
  this.setColor(this.input.value);
  UI.Picker.prototype.show.call(this);
}

UI.ColorPicker.prototype.putCrosshair = function(x, y)
{
  this.crosshair.style.left = x - Math.floor(this.crosshair.getAttribute('width')  / 2) + 'px';
  this.crosshair.style.top  = y - Math.floor(this.crosshair.getAttribute('height') / 2) + 'px';
}

UI.ColorPicker.prototype.putSlider = function(pos) {
  this.slider.style.top = pos - Math.floor(this.slider.getAttribute('height') / 2) + 'px';
}

// colors

UI.ColorPicker.prototype.setColor = function(color)
{
  if (color.trim() == '') return;

  color = new Color(color);

  var x = Math.round(this.data.gradient_w / 100 * color.s);
  var y = Math.round(this.data.gradient_h / 100 * (100 - color.v));
  this.putCrosshair(x, y);

  var i = Math.round(this.data.hue_h / 360 * color.h);
  this.putSlider(i);

  this.setBaseColor(this.getHueColor(i));
  this.applyColor(color);
}

// Sets the base color used by the [H]SV gradient.
UI.ColorPicker.prototype.setBaseColor = function(color)
{
  var color = new Color(color);
  this.data.base = color;
  this.gradient.style.backgroundColor = color.toString();
}

// Sets the picked color.
UI.ColorPicker.prototype.applyColor = function(color)
{
  color = new Color(color);

  this.preview.style.backgroundColor = color.toString();
  this.input.value = color.toString();

  if (this.options && this.options.onChange) {
    this.options.onChange(color);
  }
}

// Computes the gradient color at position (x,y).
UI.ColorPicker.prototype.getGradientColor = function(x, y)
{
  this.data.x = x;
  this.data.y = y;

  // checks min & max, then linerizes gradient to full 255 colors
  x = 255 / (this.data.gradient_w - 1) * Math.max(0, Math.min(x, this.data.gradient_w - 1));
  y = 255 / (this.data.gradient_h - 1) * Math.max(0, Math.min(y, this.data.gradient_h - 1));

  // computes color
  var r = Math.round((1 - (1 - (this.data.base.r / 255)) * (x / 255)) * (255 - y));
  var g = Math.round((1 - (1 - (this.data.base.g / 255)) * (x / 255)) * (255 - y));
  var b = Math.round((1 - (1 - (this.data.base.b / 255)) * (x / 255)) * (255 - y));

  return new Color([r, g, b]);
}

// Computes the hue color at position (i).
UI.ColorPicker.prototype.getHueColor = function(i)
{
  i -= (this.hue.offsetHeight - this.hue.clientHeight) / 2;
  i = Math.max(0, Math.min(i, this.data.hue_h));

  var section = this.data.hue_h / 6; // separates each sections
  var c  = i % this.data.hue_h;      // row
  var cs = i % section;              // row in current group
  var l  = (255 / section) * cs;     // color percentage

  var h = 255 - l;
  var r = Math.round(c < section ? 255 : c < section * 2 ? h : c < section * 4 ? 0 : c < section * 5 ? l : 255);
  var g = Math.round(c < section ? l : c < section * 3 ? 255 : c < section * 4 ? h : 0);
  var b = Math.round(c < section * 2 ? 0 : c < section * 3 ? l : c < section * 5 ? 255 : h);

  return new Color([r, g, b]);
}

// Slider

UI.ColorPicker.Slider = function(picker)
{
  var dragging = false;

  function getPosition(evt)
  {
    var pos = picker.hue.getPosition();
    return Math.min(picker.data.hue_h - 1, Math.max(0, evt.pageY - pos.y));
  }

  function getCrosshairPosition()
  {
    var pos   = picker.crosshair.getPosition();
    var g_pos = picker.gradient.getPosition();
    pos.x -= g_pos.x;
    pos.y -= g_pos.y;
    return pos;
  }

  function start(evt)
  {
    dragging = true;
    picker.hue.addEventListener('mousemove', move, null);
    window.addEventListener('mouseup', stop, null);
    move(evt);
  }

  function stop(evt)
  {
    dragging = false;
    picker.hue.removeEventListener('mousemove', move, null);
    window.removeEventListener('mouseup', stop, null);
  }

  function move(evt)
  {
    if (dragging)
    {
      evt.preventDefault();

      var s_pos = getPosition(evt);
      var c_pos = getCrosshairPosition();

      picker.putSlider(s_pos);
      picker.setBaseColor(picker.getHueColor(s_pos));
      picker.applyColor(picker.getGradientColor(c_pos.x, c_pos.y));
    }
  }

  picker.hue.addEventListener('mousedown', start, null);
  picker.slider.addEventListener('mousedown', start, null);
}

// Crosshair

UI.ColorPicker.Crosshair = function(picker)
{
  var dragging = false;

  function getPosition(evt)
  {
    var pos = picker.gradient.getPosition();
    var x = Math.min(picker.data.gradient_w - 1, Math.max(0, evt.pageX - pos.x));
    var y = Math.min(picker.data.gradient_h - 1, Math.max(0, evt.pageY - pos.y));
    return {x: x, y: y};
  }

  function start(evt)
  {
    dragging = true;
    picker.gradient.addEventListener('mousemove', move, false);
    window.addEventListener('mouseup', stop, false);
    move(evt);
  }

  function stop(evt)
  {
    dragging = false;
    picker.gradient.removeEventListener('mousemove', move, false);
    window.removeEventListener('mouseup', stop, false);
  }

  function move(evt)
  {
    if (dragging)
    {
      evt.preventDefault();

      var pos = getPosition(evt);
      picker.putCrosshair(pos.x, pos.y);
      picker.applyColor(picker.getGradientColor(pos.x, pos.y));
    }
  }

  picker.gradient.addEventListener('mousedown', start, false);
  picker.crosshair.addEventListener('mousedown', start, false);
}
*/
