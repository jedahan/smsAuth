(function() {
  var cache, redis, restify, server, start;

  restify = require('restify');

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

  server.get("/startGame", start);

  server.post("/startGame", start);

  /*
    Server Options
  */

  server.listen(process.env.PORT || 80, function() {
    return console.log("" + server.name + " listening at " + server.url);
  });

}).call(this);
