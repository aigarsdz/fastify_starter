const BaseController = require('./base_controller')

class ControllerName extends BaseController {
  index(request, response) {
    return response.view('controller_view_directory/index', {}, { layout: this.layout })
  }
}

module.exports = ControllerName
