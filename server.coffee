restify = require 'restify'
request = require 'request'
redis = require 'redis'
url = require 'url'

redis_url = url.parse(process.env.REDISTOGO_URL or 'http://127.0.0.1:6379')
cache = redis.createClient redis_url.port, redis_url.hostname

cache.on 'error', (err) ->
  console.log "Error #{err}"

start = (req, response, next) ->
  
  from = req.params.from

  next new restify.UnprocessableEntityError "from missing" unless from?
  next new restify.UnprocessableEntityError "from '#{req.params.from}' is not a number" if from is NaN

  console.info "Parsing #{from}"
  cache.exists "from:#{from}", (err, reply) ->
    console.error "Error #{err}" if err?
    if reply
      cache.get "from:#{from}", (err, reply) ->
        console.error "Error #{err}" if err?
        # increment access count by one
        response.send reply
    else
      cache.set "from:#{id}", 1, redis.print
      response.send 1

server = restify.createServer()

###
  Object API
###

server.get  "/startGame/", start

###
  Server Options
###

server.listen process.env.PORT or 8080, ->
  console.log "#{server.name} listening at #{server.url}"