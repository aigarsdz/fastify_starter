import path from 'node:path'
import fp from 'fastify-plugin'
import { Liquid } from 'liquidjs'

const engine = new Liquid({
  root: path.resolve('src/views'),
  extname: '.liquid'
})

function renderer(fastify, options) {
	fastify.decorateReply('render', async function (viewPath, data = {}) {
		if (!data.layout) {
			data.layout = options.defaultLayout
		}

		const result = await engine.renderFile(viewPath, data)

		this.header('Content-Type', 'text/html; charset=utf-8')

		this.send(result)

		return this
	})
}

const rendererPlugin = fp(renderer)

export default rendererPlugin