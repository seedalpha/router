# router

hash-based url router for browser

### Changelog

`1.1.0`:

- Add anonymous callbacks as '/'
- Nest routers
- Toggle listening on `hashchange`
- Test coverage & scripts

`1.0.0`:

- Initial release

### Installation

    $ npm install seed-router --save

### Usage

    var Router = require('seed-router');
    
    var router = new Router();
    
    router.add('/posts/:id', function(params, query) {
      // { id: '123' }
      // { scope: 'short' }
    });
    
    var router2 = new Router();
    
    router2.add('/publish', function(params, query) {
      // { id: '123' }
    });
    
    router.add('/posts/:id/, router2);
    
    router.start();
    
    router.set('#/posts/123?scope=short');
    router.set('#/posts/123/publish');
    
### Development

    $ git clone git@github.com:seedalpha/router.git
    $ cd router
    $ npm install
    $ npm test

### Author

Vladimir Popov <vlad@seedalpha.net>

### License

©2014 Seedalpha