restify = require 'restify'
redis = require 'redis'

cache = redis.createClient 6379, 'nodejitsudb4169292647.redis.irstack.com'

cache.on 'error', (err) ->
  console.log "Error #{err}"

cache.auth 'nodejitsudb4169292647.redis.irstack.com:f327cfe980c971946e80b8e975fbebb4', (err) ->
  if err
    throw err

start = (req, response, next) ->
  console.log req.params
  from = +req.params.from

  next new restify.UnprocessableEntityError "from missing" unless from?
  next new restify.UnprocessableEntityError "from '#{from}' is not a number" if from is NaN

  console.info "Parsing #{from}"
  cache.exists "from:#{from}", (err, reply) ->
    console.error "Error #{err}" if err?
    cache.incr "from:#{from}", redis.print

    console.log reply
    if reply  
      response.send reply
    else
      cache.set "from:#{from}", 1, redis.print
      response.send 1

server = restify.createServer()

###
  Object API
###

server.get  "/startGame", start
server.post  "/startGame", start

###
  Server Options
###

server.listen process.env.PORT or 80, ->
  console.log "#{server.name} listening at #{server.url}"