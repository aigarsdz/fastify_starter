const BaseController = require('./base_controller')
const { authenticate } = require('../hooks/authenticator')
const User = require('../models/user')

class Dashboard extends BaseController {
  hooks = {
    preHandler: authenticate
  }

  index(request, response) {
    const cookie = request.unsignCookie(request.cookies.auth_session_id)
    const user = new User(Number(cookie.value))

    return response.render('dashboard/index', { user })
  }
}

module.exports = Dashboard
