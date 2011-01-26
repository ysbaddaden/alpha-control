/**
 * String inflections follow the rules of ActiveSupport::Inflector of Ruby on Rails.
 */

String.prototype.capitalize = function()
{
  var str = this.toLowerCase();
  return str.charAt(0).toUpperCase() + str.substr(1);
}

String.prototype.camelize = function(lower_case_and_underscored_word)
{
  var parts = this.split('_'), str = "";
  
  if (lower_case_and_underscored_word == 'lower') {
    str = parts.shift();
  }
  
  for (var i=0; i<parts.length; i++) {
    str += parts[i].capitalize();
  }
  return str;
}

String.prototype.underscore = function()
{
  var str = this;
  str = str.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2');
  str = str.replace(/([a-z\d])([A-Z])/g, '$1_$2');
  str = str.replace(/\-/g, '_')
  return str.toLowerCase();
}

String.prototype.dasherize = function() {
  return this.replace(/_/g, '-');
}

String.prototype.transliterate = function()
{
  var str = this, from, to;
  
  for (from in Inflector.transliterateMapping)
  {
    to = Inflector.transliterateMapping[from];
    str = str.replace(new RegExp(from, 'g'), to);
  }
  return str;
}

String.prototype.parameterize = function()
{
  var str = this.transliterate();
  str = str.replace(/[^\w\d\_\-]/g, '-');
  str = str.replace(/\-{2,}/g, '-').replace(/^\-/g, '').replace(/\-$/g, '');
  return str.toLowerCase();
}

String.prototype.titleize = function()
{
  var str = this.underscore().humanize();
  str = str.replace(/\s\b[\w]/g, function(char) {
    return char.toUpperCase();
  });
  return str;
}

String.prototype.humanize = function() {
  return this.capitalize().replace(/_id$/, '').replace(/_/g, ' ');
}

String.prototype.pluralize = function() {
  return Inflector.applyRules(this, Inflector.pluralRules);
}

String.prototype.singularize = function() {
  return Inflector.applyRules(this, Inflector.singularRules);
}

String.prototype.tableize = function() {
  return this.underscore().pluralize();
}

String.prototype.classify = function() {
  return this.singularize().camelize();
}

String.prototype.constantize = function()
{
  eval("var c = " + this + ";");
  return c;
}

