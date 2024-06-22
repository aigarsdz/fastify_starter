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
      const preHandlers = {
        index: controller.beforeIndex,
        new: controller.beforeNew,
        create: controller.beforeCreate,
        view: controller.beforeView,
        edit: controller.beforeEdit,
        update: controller.beforeUpdate,
        delete: controller.beforeDelete
      }

      let urlPath = '/' + path.basename(fileName, '.js').replace(/[\s_]+/g, '-')

      if (urlPath == '/home') {
        urlPath = '/'
      }

      if (controller.beforeAll.length > 0) {
        for (const key of Object.keys(preHandlers)) {
          if (!controller.exceptBefore.includes(key)) {
            preHandlers[key] = [...preHandlers[key], ...controller.beforeAll]
          }
        }
      }

      if (controller.urlPath) {
        urlPath = controller.urlPath
      }

      if (controller.index) {
        fastify.get(urlPath, { preHandler: preHandlers.index }, controller.index.bind(controller))
      }

      if (controller.new) {
        fastify.get(`${urlPath}/new`, { preHandler: preHandlers.new }, controller.new.bind(controller))
      }

      if (controller.create) {
        fastify.post(urlPath, { preHandler: preHandlers.create }, controller.create.bind(controller))
      }

      if (controller.view) {
        fastify.get(`${urlPath}/:resourceId`, { preHandler: preHandlers.view }, controller.view.bind(controller))
      }

      if (controller.edit) {
        fastify.get(`${urlPath}/resourceId/edit`, { preHandler: preHandlers.edit }, controller.edit.bind(controller))
      }

      if (controller.update) {
        fastify.put(`${urlPath}/:resourceId`, { preHandler: preHandlers.update }, controller.update.bind(controller))
      }

      if (controller.delete) {
        fastify.get(`${urlPath}/:resourceId/delete`, { preHandler: preHandlers.delete }, controller.delete.bind(controller))
        fastify.delete(`${urlPath}/:resourceId`, { preHandler: preHandlers.delete }, controller.delete.bind(controller))
      }
    }
  }
}

module.exports = router
