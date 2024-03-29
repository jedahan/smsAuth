(function() {
  var Firebase, cache, coin, express, redis, server, start;

  express = require('express');

  redis = require('redis');

  /*
  io = require 'socket.io'
  io.listen 8080
  
  io.sockets.on 'connection', (socket) ->
    socket.emit 'news', { hello: 'world' }
  */

  Firebase = require('./firebase-node');

  coin = new Firebase('https://yodo.firebaseIO.com/coin');

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
    console.info("Parsing the number " + from);
    return cache.exists("from:" + from, function(err, reply) {
      var _this = this;
      if (err != null) console.error("Error " + err);
      if (reply === 1) {
        return cache.incr("from:" + from, function(err, reply) {
          if (err != null) console.error("Error " + err);
          coin.set(reply);
          return response.send(200, "" + reply);
        });
      } else {
        return cache.set("from:" + from, 1, function(err, reply) {
          if (err != null) console.error("Error " + err);
          coin.set(1);
          return response.send(200, "1");
        });
      }
    });
  };

  server = express();

  server.get("/startGame", start);

  server.listen(80);

}).call(this);
