const BaseController = require('./base_controller')
const { authenticate } = require('../hooks/authenticator')
const User = require('../models/user')

class Dashboard extends BaseController {
  beforeIndex = authenticate

  async index(request, response) {
    const user = await User.findByPk(request.session.userId)

    return response.view('dashboard/index', { user }, { layout: this.layout })
  }
}

module.exports = Dashboard
