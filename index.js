const path = require('path')
const fastifyHelmet = require('@fastify/helmet')
const fastifyRateLimit = require('@fastify/rate-limit')
const fastifyFormBody = require('@fastify/formbody')
const fastifyMultipart = require('@fastify/multipart')
const fastifyStatic = require('@fastify/static')
const fastifySession = require('@fastify/session')
const fastifyCookie = require('@fastify/cookie')
const fastifyView = require('@fastify/view')
const SessionStore = require('./src/session_store')
const router = require('./src/plugins/router')

require('dotenv').config()

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
fastify.register(fastifyCookie)
fastify.register(fastifySession, {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV == 'production',
  },
  store: new SessionStore(path.join(__dirname, 'data', 'sessions.sqlite'))
})
fastify.register(fastifyView, {
  engine: {
    ejs: require('ejs')
  },
  root: path.join(__dirname, 'src', 'views')
})
fastify.register(router)

fastify.listen({ port: 3000 }, (error, address) => {
  if (error) {
    fastify.log.error(error)
    process.exit(1)
  }
})
