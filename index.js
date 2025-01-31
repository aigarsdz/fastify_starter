const path = require('path')
const fastifyHelmet = require('@fastify/helmet')
const fastifyRateLimit = require('@fastify/rate-limit')
const fastifyFormBody = require('@fastify/formbody')
const fastifyMultipart = require('@fastify/multipart')
const fastifyStatic = require('@fastify/static')
const fastifyCookie = require('@fastify/cookie')
const fastifyCompress = require('@fastify/compress')
const { Liquid } = require('liquidjs')
const router = require('./src/plugins/router')
const renderer = require('./src/plugins/renderer')

require('dotenv').config()

const engine = new Liquid({
  root: path.join(__dirname, 'src/views'),
  extname: ".liquid",
})

const fastify = require('fastify')({
  logger: true
})

fastify.register(fastifyHelmet)
fastify.register(fastifyRateLimit, {
  max: 120,
  timeWindow: '1 minute'
})
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})
fastify.register(fastifyFormBody)
fastify.register(fastifyMultipart)
fastify.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET
})
fastify.register(fastifyCompress)
fastify.register(renderer, {
  defaultLayout: 'layouts/default'
})
fastify.register(router)

fastify.listen({ port: 3000 }, (error, address) => {
  if (error) {
    fastify.log.error(error)
    process.exit(1)
  }
})
