const BaseController = require('./base_controller')
const { authenticate } = require('../hooks/authenticator')

class Dashboard extends BaseController {
  beforeIndex = authenticate

  index(request, response) {
    response.view('dashboard/index', {}, { layout: this.layout })
  }
}

module.exports = Dashboard
