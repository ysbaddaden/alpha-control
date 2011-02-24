new Unit.TestCase('JSONP.RequestTest',
{
  test_request: function()
  {
    var self = this; this.async();
    var showPost = function(post)
    {
      self.sync(function() {
        self.assertEqual('2nd Post', post.post.title);
      });
    }
    var req = new JSONP.Request();
    req.open('/posts/1.json', showPost, {'callback': "cb"});
    req.send();
  },

  test_request_with_custom_callback_param: function()
  {
    var self = this; this.async();
    var showPost = function(posts)
    {
      self.sync(function() {
        self.assertEqual(2, posts.length);
      });
    }
    var req = new JSONP.Request();
    req.open('/posts.json', showPost, {'param': "cb"});
    req.send();
  },

  test_multiple_requests_should_dispatch_correctly: function()
  {
    var self = this; this.async();
    
    var showPost_1 = function(post)
    {
      self.sync(function()
      {
        self.assertEqual('1st Post', post.post.title);
        window.showPost_1 = null;
      });
    };
    var showPost_2 = function(post) { };
    var showPost_3 = function(post) { };
    
    var req_1 = new JSONP.Request(); req_1.open('/posts/1.json',   showPost_3);
    var req_2 = new JSONP.Request(); req_2.open('/posts/0.json',   showPost_1);
    var req_3 = new JSONP.Request(); req_3.open('/posts/123.json', showPost_2);
    
    req_1.send();
    req_2.send();
    req_3.send();
  }
});
