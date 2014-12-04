# router

Connect middleware-inspired router for node and browser

### Changelog

`2.0.0`:

- Stop listening on window hash change
- Nest routers
- Inline middleware
- Test coverage & scripts

`1.0.0`:

- Initial release

### Installation

    $ npm install seed-router --save

### Usage

    var Router = require('seed-router');
    
    var router = new Router();
    
    router.add('/posts/:id', function(ctx) {
      ctx.params // { id: '123' }
      ctx.query  // { scope: 'short' }
    });
    
    var nested = new Router();
    
    nested.add(function(ctx) {
      console.log('middleware');
      ctx.next();
    });
    
    nested.add('/publish', function(ctx) {
      ctx.params // { id: '123' }
    });
    
    router.add('/posts/:id/, nested);
    
    router.set('#/posts/123?scope=short', function() {
      router.set('#/posts/123/publish');
    });
    
### Development

    $ git clone git@github.com:seedalpha/router.git
    $ cd router
    $ npm install
    $ npm test

### Author

Vladimir Popov <vlad@seedalpha.net>

### License

©2014 Seedalpha