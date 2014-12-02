/**
 * Simple, frontend, hash-based router
 */


/**
 * Module dependencies
 */

var pathRegex     = require('path-to-regexp');
var qs            = require('seed-qs');
var EventEmitter  = require('events').EventEmitter;
var util          = require('util');


/**
 * Constructor
 */

function Router() {
  if (!(this instanceof Router)) {
    return new Router();
  }
  
  EventEmitter.call(this);
  
  this.routes = [];  
}

util.inherits(Router, EventEmitter);


/*
 * Trigger on window url hash change 
 *
 * @api private
 */

Router.prototype._onHashChanged = function() {
  var hash = window.location.hash.substring(1); 
  if (!hash.length)  {
    return window.location.hash = '#/';
  }
  var parts = hash.split('?');
  hash = parts.shift();
  var query = qs.parse(parts.join('?'));
    
  this.routes.some(function(route) {
    if (!route.exp.test(hash)) return;
    var result = route.exp.exec(hash);
    var params = {};
    route.keys.forEach(function(key, index) {
      params[key.name] = result[index + 1];
    });
    route.callback(params, query);
    return true;
  }.bind(this));
  
  this.emit('route', hash, query);
}


/**
 * Add a route to catch
 *
 * @param {String} uri
 * @param {Function} fn(params, query)
 * @return {Router} self
 */

Router.prototype.add = function(uri, fn) {
  
  if (!fn) {
    fn = uri;
    uri = '/';
  }
  
  if (fn instanceof Router) {
    fn.routes.forEach(function(route) {
      var keys = [], url;
      
      if (uri !== '/') {
        url = uri + route.uri;
      } else {
        url = route.uri;
      }
      
      this.routes.push({
        uri: url,
        exp: pathRegex(url, keys),
        keys: keys,
        callback: route.callback
      });
    }.bind(this));
  } else {
    var keys = [];
    this.routes.push({
      uri: uri,
      exp: pathRegex(uri, keys),
      keys: keys,
      callback: fn
    });
  }
  return this;
}


/**
 * Set window route
 *
 * @param {String} uri
 */

Router.prototype.set = function(uri) {
  if (uri.indexOf('http') === 0) {
    return window.location.href = uri;
  }
  if (uri[0] === '#')
    uri = uri.substring(1);
  if (uri[0] !== '/')
    uri = '/' + uri;
  window.location.hash = uri;
}


/**
 * Trigger initial check
 */

Router.prototype.start = function() {
  this._listener = this._listener || this._onHashChanged.bind(this);
  window.addEventListener('hashchange', this._listener, false);
  this._listener();
}


/**
 * Suspend operation
 */

Router.prototype.stop = function() {
  window.removeEventListener('hashchange', this._listener);
}


/**
 * Expose
 */

exports = module.exports = Router;