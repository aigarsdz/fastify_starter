const path = require('path')
const fp = require('fastify-plugin')
const { Liquid } = require('liquidjs')

const engine = new Liquid({
  root: path.join(path.dirname(__dirname), 'views'),
  extname: '.liquid'
})

function renderer(fastify, options) {
	fastify.decorateReply('render', async function (viewPath, data) {
		if (!data.layout) {
			data.layout = options.defaultLayout
		}

		const result = await engine.renderFile(viewPath, data)

		this.header('Content-Type', 'text/html; charset=utf-8')

		this.send(result)

		return this
	})
}

module.exports = fp(renderer)