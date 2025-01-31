const BaseController = require('./base_controller')

class ControllerName extends BaseController {
  index(request, response) {
    return response.render('controller_view_directory/index')
  }
}

module.exports = ControllerName
