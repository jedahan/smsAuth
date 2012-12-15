(function() {
  var cache, express, redis, server, start;

  express = require('express');

  redis = require('redis');

  cache = redis.createClient(6379, 'nodejitsudb4169292647.redis.irstack.com');

  cache.on('error', function(err) {
    return console.log("Error " + err);
  });

  cache.auth('nodejitsudb4169292647.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4', function(err) {
    if (err) throw err;
  });

  start = function(req, response, next) {
    var from;
    from = +req.query.from;
    /*
      cache.exists "from:#{from}", (err, reply) ->
        console.error "Error #{err}" if err?
        cache.incr "from:#{from}", redis.print
    
        console.log reply
        if reply  
          response.send reply
        else
          cache.set "from:#{from}", 1, redis.print
          response.send 1
    */
    return response.send(200, "" + from);
  };

  server = express();

  /*
    Object API
  */

  server.get("/startGame", start);

  /*
    Server Options
  */

  server.listen(80);

}).call(this);
