# router

hash-based url router for browser

### Changelog

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
    
    router.start();
    
    router.set('#/posts/123?scope=short');
    
### Development

    $ git clone git@github.com:seedalpha/router.git
    $ cd router
    $ npm install
    $ npm test

### Author

Vladimir Popov <vlad@seedalpha.net>

### License

©2014 Seedalpha