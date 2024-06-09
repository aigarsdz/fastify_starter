const argon2 = require('argon2')
const BaseController = require('./base_controller')
const User = require('../models/user')

class Registration extends BaseController {
  index(request, response) {
    return response.view('registration/index', {}, { layout: this.layout })
  }

  async create(request, response) {
    const passwordHash = await argon2.hash(request.body.password)
    const user = await User.create({ username: request.body.username, password: passwordHash })

    request.session.userId = user.id

    return response.redirect('/dashboard')
  }
}

module.exports = Registration
