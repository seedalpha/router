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
    done();
  });
  router.start();
  setTimeout(function() {
    router.set(window.location.href + 'post/123');
  }, 0);
});