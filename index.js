import path from 'node:path'
import fastify from 'fastify'
import fastifyHelmet from '@fastify/helmet'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifyFormBody from '@fastify/formbody'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastifyCookie from '@fastify/cookie'
import fastifyCompress from '@fastify/compress'
import { Liquid } from 'liquidjs'
import router from '#router'
import renderer from '#renderer'
console.log(process.env)
const engine = new Liquid({
  root: path.resolve('src/views'),
  extname: ".liquid",
})

const app = fastify({
  logger: true
})

app.register(fastifyHelmet)
app.register(fastifyRateLimit, {
  max: 120,
  timeWindow: '1 minute'
})
app.register(fastifyStatic, {
  root: path.resolve('public'),
  prefix: '/public/'
})
app.register(fastifyFormBody)
app.register(fastifyMultipart)
app.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET
})
app.register(fastifyCompress)
app.register(renderer, {
  defaultLayout: 'layouts/default'
})
app.register(router)

app.listen({ port: 3000 }, (error, address) => {
  if (error) {
    app.log.error(error)
    process.exit(1)
  }
})
