express = require 'express'
redis = require 'redis'

cache = redis.createClient 6379, 'nodejitsudb4169292647.redis.irstack.com'

cache.on 'error', (err) ->
  console.log "Error #{err}"

cache.auth 'nodejitsudb4169292647.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4', (err) ->
  if err
    throw err

start = (req, response, next) ->
  from = +req.query.from

  console.info "Parsing the number #{from}"
  
  cache.exists "from:#{from}", (err, reply) ->
    console.error "Error #{err}" if err?
    if reply is 1
      cache.incr "from:#{from}", (err, reply) =>
        console.error "Error #{err}" if err?
        response.send 200, "#{reply}"
    else    
      cache.set "from:#{from}", 1, (err, reply) =>
        console.error "Error #{err}" if err?
        response.send 200, "1"
  
server = express()

server.get  "/startGame", start

server.listen 80