new Unit.TestCase('RailsTest',
{
  test_getMeta: function()
  {
    this.assertNotNull(Rails.readMeta('csrf-param'));
    this.assertEqual('authenticity_token', Rails.readMeta('csrf-param'));
    
    this.assertNotNull(Rails.readMeta('csrf-token'));
    this.assertNotEqual('', Rails.readMeta('csrf-token'));
  },

  test_toURLEncoded: function()
  {
    this.assertEqual('a=b', Rails.toURLEncoded("a=b"));
    this.assertEqual('a=b', Rails.toURLEncoded({a: 'b'}));
    this.assertEqual('a=b&c=d', Rails.toURLEncoded({a: 'b', c: 'd'}));
    this.assertEqual('a=%20%C3%A9lipse&c=d', Rails.toURLEncoded({a: ' élipse', c: 'd'}));
  }
});

new Unit.TestCase('Rails.RequestTest',
{
  test_get_xml: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('get', '/posts.xml');
    req.onloadend = function(event)
    {
      self.sync(function()
      {
        self.assertEqual(200, event.request.status);
        self.assertMatch(/application\/xml/, event.request.getResponseHeader('Content-Type'));
        self.assertEqual(2, event.request.responseXML.getElementsByTagName('post').length);
      });
    }
    req.send();
  },

  test_get_json: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('get', '/posts/1.json');
    req.onloadend = function(event)
    {
      self.sync(function()
      {
        self.assertEqual(200, event.request.status);
        self.assertMatch(/application\/json/, event.request.getResponseHeader('Content-Type'));
        self.assertEqual({post: {id: 1, title: '2nd Post'}}, JSON.parse(event.request.responseText));
      });
    }
    req.send();
  },

  test_get_failure: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('get', '/posts/123.json');
    req.onloadend = function(event)
    {
      self.sync(function() {
        self.assertEqual(404, event.request.status);
      });
    }
    req.send()
  },

  test_post_json: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('post', '/posts.json');
    req.onloadend = function(event)
    {
      self.sync(function()
      {
        self.assertEqual(201, event.request.status);
        self.assertMatch(/application\/json/, event.request.getResponseHeader('Content-Type'));
        self.assertMatch(/\/posts\/\d+/, event.request.getResponseHeader('Location'));
        self.assertEqual('3rd Post', JSON.parse(event.request.responseText).post.title);
      });
    }
    req.send({'post[title]': '3rd Post'});
  },

// NOTE: disabled since HTML event.requests are redirected and that you can't stop the redirection with XHR.
//  test_post_html: function()
//  {
//    var self = this;
//    this.async();
//    
//    Rails.post('/posts.html', {'post[title]': '3rd Post'}, function(event.request)
//    {
//      if (event.request.readyState != 4) return;
//      self.sync(function() {
//        self.assertEqual(302, event.request.status);
//      });
//    });
//  },

  test_post_failure: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('post', '/posts.xml');
    req.onloadend = function(event)
    {
      self.sync(function()
      {
        self.assertEqual(412, event.request.status);
        self.assertMatch(/application\/xml/, event.request.getResponseHeader('Content-Type'));
        self.assertNull(event.request.getResponseHeader('Location') || null);
      });
    }
    req.send({'post[title]': ''});
  },

  test_post_with_custom_body: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('post', '/posts.xml');
    req.onloadend = function(event)
    {
      self.sync(function() {
        self.assertEqual(201, event.request.status);
      });
    }
    req.send(encodeURIComponent("post[title]") + "=some post");
  },

  test_put: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('put', '/posts/1.xml');
    req.onloadend = function(event)
    {
      self.sync(function()
      {
        self.assertEqual(200, event.request.status);
        self.assertMatch(/application\/xml/, event.request.getResponseHeader('Content-Type'));
        self.assertNull(event.request.getResponseHeader('Location') || null);
      });
    }
    req.send({'post[title]': 'some other title'});
  },

  test_put_failure: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('put', '/posts/1.xml');
    req.onloadend = function(event)
    {
      self.sync(function()
      {
        self.assertEqual(412, event.request.status);
        self.assertMatch(/application\/xml/, event.request.getResponseHeader('Content-Type'));
        self.assertNull(event.request.getResponseHeader('Location') || null);
      });
    }
    req.send({'post[title]': ''});
  },

  test_put_with_custom_body: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('put', '/posts/1.xml');
    req.onloadend = function(event)
    {
      self.sync(function() {
        self.assertEqual(200, event.request.status);
      });
    }
    req.send(encodeURIComponent("post[title]") + "=some post");
  },

  test_delete: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('delete', '/posts/1.xml');
    req.onloadend = function(event)
    {
      self.sync(function()
      {
        self.assertEqual(200, event.request.status);
        self.assertMatch(/application\/xml/, event.request.getResponseHeader('Content-Type'));
        self.assertNull(event.request.getResponseHeader('Location') || null);
      });
    }
    req.send();
  },

  test_delete_failure: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open('delete', '/posts/123.xml');
    req.onloadend = function(event)
    {
      self.sync(function() {
        self.assertEqual(404, event.request.status);
      });
    }
    req.send();
  },

  test_loadstart_event: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open("DELETE", '/posts/3.xml');
    req.addEventListener('loadstart', function(event)
    {
      self.sync(function() {
        self.assertTrue(true);
      });
    });
    req.send();
  },

  test_loadend_event_with_failure_response: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open("POST", '/posts.xml');
    req.addEventListener('loadend', function(event)
    {
      self.sync(function() {
        self.assertTrue(true);
      });
    });
    req.send();
  },

  test_loadend_event_with_success_response: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open("GET", '/posts.json');
    req.addEventListener('loadend', function(event)
    {
      self.sync(function() {
        self.assertTrue(true);
      });
    });
    req.send();
  },

  test_load_event_with_success_response: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open("GET", '/posts.json');
    req.addEventListener('load', function(event)
    {
      self.sync(function() {
        self.assertTrue(true);
      });
    });
    req.send();
  },

  test_error_event_with_failure_response: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open("GET", '/posts/10.json');
    req.addEventListener('error', function(event)
    {
      self.sync(function() {
        self.assertTrue(true);
      });
    });
    req.send();
  },

  test_abort_event_before_send: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open("GET", '/posts/1.xml');
    req.addEventListener('abort', function(event)
    {
      self.sync(function() {
        self.assertTrue(true);
      });
    });
    req.abort();
  },

  test_abort_event_after_send: function()
  {
    var self = this, req = new Rails.Request(); this.async();
    req.open("GET", '/posts/1.xml');
    req.onabort = function(event)
    {
      self.sync(function() {
        self.assertTrue(true);
      });
    }
    req.send();
    req.abort();
  }
});
