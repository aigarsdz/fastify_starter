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
        fastify.get(urlPath, { preHandler: controller.beforeIndex }, controller.index.bind(controller))
      }

      if (controller.new) {
        fastify.get(`${urlPath}/new`, controller.new.bind(controller))
      }

      if (controller.create) {
        fastify.post(urlPath, controller.create.bind(controller))
      }

      if (controller.view) {
        fastify.get(`${urlPath}/:resourceId`, controller.view.bind(controller))
      }

      if (controller.edit) {
        fastify.get(`${urlPath}/resourceId/edit`, controller.edit.bind(controller))
      }

      if (controller.update) {
        fastify.put(`${urlPath}/:resourceId`, controller.update.bind(controller))
      }

      if (controller.delete) {
        fastify.get(`${urlPath}/:resourceId/delete`, controller.delete.bind(controller))
        fastify.delete(`${urlPath}/:resourceId`, controller.delete.bind(controller))
      }
    }
  }
}

module.exports = router
