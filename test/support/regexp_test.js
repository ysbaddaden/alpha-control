new Unit.TestCase('RegExpTest',
{
  test_escape: function() {
    this.assertEqual('\\.\\*\\+\\?\\|\\(\\)\\[\\]\\{\\}\\\\', RegExp.escape('.*+?|()[]{}\\'));
  }
});
