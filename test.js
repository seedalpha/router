var assert  = require('assert');
var Router  = require('./');

suite('html');

test('should create an instance of Router', function() {    
  var router = new Router();
  assert.equal(router instanceof Router, true);
});

test('should add a new route handle', function() {
  var router = new Router();
  router.add('/hello', function(params, query) {});
  assert.equal(router.routes.length, 1);
});

test('should trigger route', function(done) {
  var router = new Router();
  router.add('/abc', function() {
    router.stop();
    done();
  });
  router.start();
  setTimeout(function() {
    router.set(window.location.href + 'abc');
  }, 0);
});

test('should get route params', function(done) {
  var router = new Router();
  router.add('/abcpost/:id', function(params) {
    assert.equal(params.id, '123');
    router.stop();
    done();
  });
  router.start();
  setTimeout(function() {
    router.set(window.location.href + 'post/123');
  }, 0);
});

test('should handle empty uri', function(done) {
  var router = new Router();
  router.add(function(params) {
    router.stop();
    done();
  });
  router.start();
  setTimeout(function() {
    router.set('/');
  }, 0);
});

test('should handle nested routers', function(done) {
  
  var router = new Router();
  var router2 = new Router();
  
  router2.add(function() {
    router.stop();
    done();
  });
  
  router.add('/abc', router2);
  
  router.start();
  setTimeout(function() {
    router.set('/abc');
  }, 0);
});

test('should handle deeply nested routers', function(done) {
  
  var router = new Router();
  var router2 = new Router();
  var router3 = new Router();
  
  router3.add('/3', function(params) {
    assert.equal(params.x, 2);
    router.stop();
    router2.stop();
    router3.stop();
    done();
  });
  
  router2.add('/:x', router3);
  router.add('/1', router2);
  
  router.start();
  setTimeout(function() {
    router.set('/1/2/3');
  }, 0);
});