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

  #next new restify.UnprocessableEntityError "from missing" unless from?
  #next new restify.UnprocessableEntityError "from '#{from}' is not a number" if from is NaN

  console.info "Parsing #{from}"
  
  cache.exists "from:#{from}", (err, reply) ->
    console.error "Error #{err}" if err?
    cache.incr "from:#{from}", redis.print

    if reply
      +reply++
      response.send 200,"#{reply}"
    else
      cache.set "from:#{from}", 1, redis.print
      response.send 200,"1"
  
server = express()

###
  Object API
###

server.get  "/startGame", start

###
  Server Options
###

server.listen 80