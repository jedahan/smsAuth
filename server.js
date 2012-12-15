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
    console.info("Parsing " + from);
    return cache.exists("from:" + from, function(err, reply) {
      if (err != null) console.error("Error " + err);
      if (reply) {
        return cache.incr("from:" + from, function(err, reply) {
          if (err != null) console.error("Error " + err);
          return response.send(200, reply);
        });
      } else {
        cache.set("from:" + from, 1, redis.print);
        return response.send(200, "1");
      }
    });
  };

  server = express();

  server.get("/startGame", start);

  server.listen(80);

}).call(this);
