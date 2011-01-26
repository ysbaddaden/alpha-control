SingularToPlural = {
  "search"      : "searches",
  "switch"      : "switches",
  "fix"         : "fixes",
  "box"         : "boxes",
  "process"     : "processes",
  "address"     : "addresses",
  "case"        : "cases",
  "stack"       : "stacks",
  "wish"        : "wishes",
  "fish"        : "fish",
  "jeans"       : "jeans",
  "funky jeans" : "funky jeans",

  "category"    : "categories",
  "query"       : "queries",
  "ability"     : "abilities",
  "agency"      : "agencies",
  "movie"       : "movies",

  "archive"     : "archives",

  "index"       : "indices",

  "wife"        : "wives",
  "safe"        : "saves",
  "half"        : "halves",

  "move"        : "moves",

  "person"      : "people",
  "salesperson" : "salespeople",

  "spokesman"   : "spokesmen",
  "man"         : "men",
  "woman"       : "women",

  "basis"       : "bases",
  "diagnosis"   : "diagnoses",
  "diagnosis_a" : "diagnosis_as",

  "datum"       : "data",
  "medium"      : "media",
  "analysis"    : "analyses",

  "node_child"  : "node_children",
  "child"       : "children",

  "experience"  : "experiences",
  "day"         : "days",

  "comment"     : "comments",
  "foobar"      : "foobars",
  "newsletter"  : "newsletters",

  "old_news"    : "old_news",
  "news"        : "news",

  "series"      : "series",
  "species"     : "species",

  "quiz"        : "quizzes",

  "perspective" : "perspectives",

  "ox"          : "oxen",
  "photo"       : "photos",
  "buffalo"     : "buffaloes",
  "tomato"      : "tomatoes",
  "dwarf"       : "dwarves",
  "elf"         : "elves",
  "information" : "information",
  "equipment"   : "equipment",
  "bus"         : "buses",
  "status"      : "statuses",
  "status_code" : "status_codes",
  "mouse"       : "mice",

  "louse"       : "lice",
  "house"       : "houses",
  "octopus"     : "octopi",
  "virus"       : "viri",
  "alias"       : "aliases",
  "portfolio"   : "portfolios",

  "vertex"      : "vertices",
  "matrix"      : "matrices",
  "matrix_fu"   : "matrix_fus",

  "axis"        : "axes",
  "testis"      : "testes",
  "crisis"      : "crises",

  "rice"        : "rice",
  "shoe"        : "shoes",

  "horse"       : "horses",
  "prize"       : "prizes",
  "edge"        : "edges",

  "cow"         : "kine",
  "database"    : "databases"
}

new Unit.TestCase('StringTest',
{
  test_camelize: function()
  {
    this.assertEqual('Account', "account".camelize());
    this.assertEqual('ActiveRecord', "active_record".camelize());
    this.assertEqual('TagCloudHelper', "tag_cloud_helper".camelize());
    
    this.assertEqual('Active record', "active record".camelize());
    this.assertEqual('TagCloud helper', "tag_cloud helper".camelize());
    
    this.assertEqual('tagCloudHelper', "tag_cloud_helper".camelize('lower'));
    this.assertEqual('SslError', "ssl_error".camelize());
  },

  test_underscore: function()
  {
    this.assertEqual('account', "Account".underscore());
    this.assertEqual('active_record', "ActiveRecord".underscore());
    this.assertEqual('tag_cloud_helper', "TagCloudHelper".underscore());
    this.assertEqual('ssl_error', "SSLError".underscore());
    
    this.assertEqual('tag_cloud_helper', "tagCloudHelper".underscore());
    this.assertEqual('tag_cloud_helper', "TagCloudHelper".underscore());
    
    this.assertEqual('html_tidy', 'HTMLTidy'.underscore());
    this.assertEqual('area51_controller', 'Area51Controller'.underscore());
  },

  test_capitalize: function()
  {
    this.assertEqual('Hello',  'hello'.capitalize());
    this.assertEqual('Hello',  'HELLO'.capitalize());
    this.assertEqual('123abc', '123ABC'.capitalize());
    this.assertEqual('Hello world!',  'hello world!'.capitalize());
  },

  test_dasherize: function()
  {
    this.assertEqual('Hello world!',  'Hello world!'.dasherize());
    this.assertEqual('Hello-world!',  'Hello_world!'.dasherize());
    this.assertEqual('hello-World!',  'hello_World!'.dasherize());
  },

  test_transliterate: function()
  {
    this.assertEqual("AEroskobing", "Ærøskøbing".transliterate());
    this.assertEqual("Voix ambigue d'un coeur qui, au zephir, prefere les jattes de kiwis.",
      "Voix ambiguë d'un cœur qui, au zéphir, préfère les jattes de kiwis.".transliterate());
    this.assertEqual("Mon pauvre zebu ankylose choque deux fois ton wagon jaune.",
      "Mon pauvre zébu ankylosé choque deux fois ton wagon jaune.".transliterate());
  },

  test_parameterize: function()
  {
    this.assertEqual('hello-world', 'Hello World!'.parameterize());
    this.assertEqual('mon-pauvre-zebu-ankylose-choque-deux-fois-ton-wagon-jaune',
      ' Mon pauvre zébu ankylosé - choque deux fois ton wagon jaune. '.parameterize());
  },

  test_humanize: function()
  {
    this.assertEqual('Employee salary', "employee_salary".humanize());
    this.assertEqual('Employee', "employee_id".humanize());
    this.assertEqual('Underground', "underground".humanize());
  },

  test_titleize: function()
  {
    this.assertEqual('Active Record', "ActiveRecord".titleize());
    this.assertEqual('Active Record', "active_record".titleize());
    this.assertEqual('Action Web Service', 'action web service'.titleize());
    this.assertEqual('Action Web Service', 'Action Web Service'.titleize());
    this.assertEqual('Action Web Service', 'Action web service'.titleize());
    this.assertEqual('Actionwebservice', 'actionwebservice'.titleize());
    this.assertEqual('Actionwebservice', 'Actionwebservice'.titleize());
    this.assertEqual("David's Code", "david's code".titleize());
    this.assertEqual("David's Code", "David's code".titleize());
    this.assertEqual("David's Code", "david's Code".titleize());
  },

  test_pluralize: function()
  {
    for (var singular in SingularToPlural)
    {
      var plural = SingularToPlural[singular];
      this.assertEqual(plural, singular.pluralize());
      this.assertEqual(plural.capitalize(), singular.capitalize().pluralize());
    }
  },

  test_singularize: function()
  {
    for (var singular in SingularToPlural)
    {
      var plural = SingularToPlural[singular];
      this.assertEqual(singular, plural.singularize());
      this.assertEqual(singular.capitalize(), plural.capitalize().singularize());
    }
  },

  test_tableize: function()
  {
    this.assertEqual("primary_spokesmen", "PrimarySpokesman".tableize())
    this.assertEqual("node_children", "NodeChild".tableize())
  },

  test_classify: function()
  {
    this.assertEqual("PrimarySpokesman", "primary_spokesmen".classify())
    this.assertEqual("NodeChild", "node_children".classify())
  }
});
