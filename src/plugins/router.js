const path = require('path')
const fs = require('node:fs/promises')

async function router(fastify) {
  const controllersDir = path.join(path.dirname(__dirname), 'controllers')
  const controllerFiles = await fs.readdir(controllersDir)

  for (let fileName of controllerFiles) {
    const filePath = path.join(controllersDir, fileName)

    if ((await fs.lstat(filePath)).isFile()) {
      const ControllerClass = require(filePath)
      const controller = new ControllerClass()

      let urlPath = '/' + path.basename(fileName, '.js').replace(/[\s_]+/g, '-')

      if (urlPath == '/home') {
        urlPath = '/'
      }

      if (controller.urlPath) {
        urlPath = controller.urlPath
      }

      if (controller.index) {
        fastify.get(urlPath, { preHandler: controller.beforeIndex }, controller.index)
      }

      if (controller.new) {
        fastify.get(`${urlPath}/new`, controller.new)
      }

      if (controller.create) {
        fastify.post(urlPath, controller.create)
      }

      if (controller.view) {
        fastify.get(`${urlPath}/:resourceId`, controller.view)
      }

      if (controller.edit) {
        fastify.get(`${urlPath}/resourceId/edit`, controller.edit)
      }

      if (controller.update) {
        fastify.put(`${urlPath}/:resourceId`, controller.update)
      }

      if (controller.delete) {
        fastify.get(`${urlPath}/:resourceId/delete`, controller.delete)
        fastify.delete(`${urlPath}/:resourceId`, controller.delete)
      }
    }
  }
}

module.exports = router
