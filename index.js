/**
 * Connect middleware-inspired router for node and browser
 */


/**
 * Module dependencies
 */

var pathRegex     = require('path-to-regexp');
var qs            = require('seed-qs');
var Queue         = require('seed-queue');


/**
 * Constructor
 */

function Router() {
  if (!(this instanceof Router)) {
    return new Router();
  }
  
  this.routes = [];  
}


/**
 * Add a route to catch
 *
 * @param {String} uri
 * @param {Function} fn(ctx)
 * @return {Router} self
 */

Router.prototype.add = function(uri, fn) {
  
  var args = Array.prototype.slice.call(arguments);
  
  var uri;
  if (typeof args[0] === 'string') {
    uri = args.shift();
  } else {
    uri = '/';
  }
  
  args.forEach(function(fn) {
    if (fn instanceof Router) {
      var keys = [];
      this.routes.push({
        uri: uri,
        exp: pathRegex(uri, keys),
        keys: keys,
        callback: function(ctx) {
          fn.set({ 
            hash: '/', 
            query: ctx.query
          }, function(error, result) {
            if (error) return ctx.error(error);
            if (result) return ctx.result(result);
            ctx.next();
          });
        }
      });
    
      var longUri = uri + '/:__layer*';
      keys = [];
      this.routes.push({
        uri: longUri,
        exp: pathRegex(longUri, keys),
        keys: keys,
        callback: function(ctx) {
          var layer = ctx.params.__layer;
          if (layer) {
            layer = '/' + layer; 
          } else {
            layer = '/';
          }
          fn.set({ 
            hash: layer, 
            query: ctx.query
          }, function(error, result) {
            if (error) return ctx.error(error);
            if (result) return ctx.result(result);
            ctx.next();
          });
        }
      });
    } else {
      var keys = [];
      this.routes.push({
        uri: uri,
        exp: pathRegex(uri, keys),
        keys: keys,
        callback: fn
      });
    }
  }.bind(this));
  return this;
}


/**
 * Set route
 *
 * @param {String} uri
 * @param {Function} cb(error, result)
 */

Router.prototype.set = function(uri, cb) {
  
  var hash, query;
  
  cb = cb || function(){};
  
  if (typeof uri === 'string') {
    var parts = uri.split('?');
    hash = parts.shift();
    query = qs.parse(parts.join('?'));
  } else {
    hash = uri.hash;
    query = uri.query || {};
  }
  
  var q = new Queue();
  
  this.routes.forEach(function(route) {
    if (!route.exp.test(hash)) return;
    
    var result = route.exp.exec(hash);
    
    var params = {};
    
    route.keys.forEach(function(key, index) {
      params[key.name] = result[index + 1];
    });
    
    q.add(function(next) {
      route.callback({ 
        params: params, 
        query: query, 
        next: next, 
        error: function(err) {
          next({ error: err });
        }, 
        result: function(result) {
          next({ result: result || true });
        }
      });
    });
  });
  
  q.end(function(out) {
    out = out || {};
    if (out.error) return cb(out.error);
    cb(null, out.result || false);
  });
}


/**
 * Expose
 */

exports = module.exports = Router;