const path = require('path')
const fs = require('node:fs/promises')
const fp = require('fastify-plugin')

async function router(fastify) {
  const controllersDir = path.join(path.dirname(__dirname), 'controllers')
  const controllerFiles = await fs.readdir(controllersDir)

  for (const fileName of controllerFiles) {
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
        fastify.get(urlPath, { ...controller.hooks, ...controller.indexHooks }, controller.index.bind(controller))
      }

      if (controller.new) {
        fastify.get(`${urlPath}/new`, { ...controller.hooks, ...controller.newHooks }, controller.new.bind(controller))
      }

      if (controller.create) {
        fastify.post(urlPath, { ...controller.hooks, ...controller.createHooks }, controller.create.bind(controller))
      }

      if (controller.view) {
        fastify.get(`${urlPath}/:resourceId`, { ...controller.hooks, ...controller.viewHooks }, controller.view.bind(controller))
      }

      if (controller.edit) {
        fastify.get(`${urlPath}/resourceId/edit`, { ...controller.hooks, ...controller.editHooks }, controller.edit.bind(controller))
      }

      if (controller.update) {
        fastify.put(`${urlPath}/:resourceId`, { ...controller.hooks, ...controller.updateHooks }, controller.update.bind(controller))
        fastify.post(`${urlPath}/:resourceId`, { ...controller.hooks, ...controller.updateHooks }, controller.update.bind(controller))
      }

      if (controller.delete) {
        fastify.get(`${urlPath}/:resourceId/delete`, { ...controller.hooks, ...controller.deleteHooks }, controller.delete.bind(controller))
        fastify.post(`${urlPath}/:resourceId/delete`, { ...controller.hooks, ...controller.deleteHooks }, controller.delete.bind(controller))
        fastify.delete(`${urlPath}/:resourceId`, { ...controller.hooks, ...controller.deleteHooks }, controller.delete.bind(controller))
      }

      if (controller.customRoutes) {
        for (const route of controller.customRoutes) {
          let customRouteHooks = { ...route.hooks }

          if (route.length > 3) {
            customRouteHooks = { ...customRouteHooks, ...route[3] }
          }

          fastify[route[0]](route[1], customRouteHooks, route[2].bind(controller))
        }
      }
    }
  }
}

module.exports = fp(router)
