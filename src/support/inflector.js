/**
 * Inflector is mostly a port of ActiveSupport::Inflector from Ruby on Rails.
 */

var Inflector = {}

Inflector.transliterateMapping = {
  'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç':
  'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I', 'Î': 'I',
  'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö':
  'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'Ű': 'U',
  'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à':'a', 'á':'a', 'â': 'a', 'ã': 'a', 'ä':
  'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
  'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i', 'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó':
  'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u',
  'û': 'u', 'ü': 'u', 'ű': 'u', 'ý': 'y', 'þ': 'th', 'ÿ': 'y',
  'œ': 'oe', 'Œ': 'OE'
}

Inflector.pluralRules      = [];
Inflector.singularRules    = [];
Inflector.uncountableRules = [];

Inflector.plural = function(re, replacement) {
  Inflector.pluralRules.unshift([re, replacement]);
}

Inflector.singular = function(re, replacement) {
  Inflector.singularRules.unshift([re, replacement]);
}

Inflector.irregular = function(singular, plural)
{
  Inflector.plural(new RegExp(RegExp.escape(singular) + "$", 'i'), function(word) {
    return word.match(/^[A-Z]/) ? plural.capitalize() : plural;
  });
  Inflector.singular(new RegExp(RegExp.escape(plural) + "$", 'i'), function(word) {
    return word.match(/^[A-Z]/) ? singular.capitalize() : singular;
  });
}

Inflector.uncountable = function(words)
{
  for (var i=0; i<words.length; i++) {
    Inflector.uncountableRules.push(new RegExp(RegExp.escape(words[i]) + '$', 'i'));
  }
}

Inflector.is_countable = function(word)
{
  for (var i=0; i<Inflector.uncountableRules.length; i++)
  {
    if (word.match(Inflector.uncountableRules[i])) {
      return false;
    }
  }
  return true;
}

Inflector.applyRules = function(word, rules)
{
  var i, re;
  
  if (word.trim() != "" && Inflector.is_countable(word))
  {
    for (i=0; i<rules.length; i++)
    {
      re = rules[i][0];
      
      if (word.match(re)) {
        return word.replace(re, rules[i][1]);
      }
    }
  }
  return word;
}

Inflector.plural(/$/, 's');
Inflector.plural(/s$/i, 's');
Inflector.plural(/(ax|test)is$/i, '$1es');
Inflector.plural(/(octop|vir)us$/i, '$1i');
Inflector.plural(/(alias|status)$/i, '$1es');
Inflector.plural(/(bu)s$/i, '$1ses');
Inflector.plural(/(buffal|tomat)o$/i, '$1oes');
Inflector.plural(/([ti])um$/i, '$1a');
Inflector.plural(/sis$/i, 'ses');
Inflector.plural(/(?:([^f])fe|([lr])f)$/i, '$1$2ves');
Inflector.plural(/(hive)$/i, '$1s');
Inflector.plural(/([^aeiouy]|qu)y$/i, '$1ies');
Inflector.plural(/(x|ch|ss|sh)$/i, '$1es');
Inflector.plural(/(matr|vert|ind)(?:ix|ex)$/i, '$1ices');
Inflector.plural(/([m|l])ouse$/i, '$1ice');
Inflector.plural(/^(ox)$/i, '$1en');
Inflector.plural(/(quiz)$/i, '$1zes');

Inflector.singular(/s$/i, '');
Inflector.singular(/(n)ews$/i, '$1ews');
Inflector.singular(/([ti])a$/i, '$1um');
Inflector.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1$2sis');
Inflector.singular(/(^analy)ses$/i, '$1sis');
Inflector.singular(/([^f])ves$/i, '$1fe');
Inflector.singular(/(hive)s$/i, '$1');
Inflector.singular(/(tive)s$/i, '$1');
Inflector.singular(/([lr])ves$/i, '$1f');
Inflector.singular(/([^aeiouy]|qu)ies$/i, '$1y');
Inflector.singular(/(s)eries$/i, '$1eries');
Inflector.singular(/(m)ovies$/i, '$1ovie');
Inflector.singular(/(x|ch|ss|sh)es$/i, '$1');
Inflector.singular(/([m|l])ice$/i, '$1ouse');
Inflector.singular(/(bus)es$/i, '$1');
Inflector.singular(/(o)es$/i, '$1');
Inflector.singular(/(shoe)s$/i, '$1');
Inflector.singular(/(cris|ax|test)es$/i, '$1is');
Inflector.singular(/(octop|vir)i$/i, '$1us');
Inflector.singular(/(alias|status)es$/i, '$1');
Inflector.singular(/^(ox)en/i, '$1');
Inflector.singular(/(vert|ind)ices$/i, '$1ex');
Inflector.singular(/(matr)ices$/i, '$1ix');
Inflector.singular(/(quiz)zes$/i, '$1');
Inflector.singular(/(database)s$/i, '$1');

Inflector.irregular('person', 'people')
Inflector.irregular('man', 'men')
Inflector.irregular('child', 'children')
Inflector.irregular('sex', 'sexes')
Inflector.irregular('move', 'moves')
Inflector.irregular('cow', 'kine')

Inflector.uncountable(['equipment', 'information', 'rice', 'money', 'species',
  'series', 'fish', 'sheep', 'jeans']);

