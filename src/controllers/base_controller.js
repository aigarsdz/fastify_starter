class BaseController {
  layout = 'layouts/index'
  beforeAll = []
  exceptBefore = []
  beforeIndex = [async () => {}]
  beforeNew = [async () => {}]
  beforeCreate = [async () => {}]
  beforeView = [async () => {}]
  beforeEdit = [async () => {}]
  beforeUpdate = [async () => {}]
  beforeDelete = [async () => {}]
}

module.exports = BaseController
