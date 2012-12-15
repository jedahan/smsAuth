(function() {
  var cache, redis, redis_url, request, restify, server, start, url;

  restify = require('restify');

  request = require('request');

  redis = require('redis');

  url = require('url');

  redis_url = url.parse(process.env.REDISTOGO_URL || 'http://127.0.0.1:6379');

  cache = redis.createClient(redis_url.port, redis_url.hostname);

  cache.on('error', function(err) {
    return console.log("Error " + err);
  });

  start = function(req, response, next) {
    var from;
    from = req.params.from;
    if (from == null) next(new restify.UnprocessableEntityError("from missing"));
    if (from === NaN) {
      next(new restify.UnprocessableEntityError("from '" + req.params.from + "' is not a number"));
    }
    console.info("Parsing " + from);
    return cache.exists("from:" + from, function(err, reply) {
      if (err != null) console.error("Error " + err);
      if (reply) {
        return cache.get("from:" + from, function(err, reply) {
          if (err != null) console.error("Error " + err);
          return response.send(reply);
        });
      } else {
        cache.set("from:" + id, 1, redis.print);
        return response.send(1);
      }
    });
  };

  server = restify.createServer();

  /*
    Object API
  */

  server.get("/startGame/", start);

  /*
    Server Options
  */

  server.listen(process.env.PORT || 8080, function() {
    return console.log("" + server.name + " listening at " + server.url);
  });

}).call(this);
