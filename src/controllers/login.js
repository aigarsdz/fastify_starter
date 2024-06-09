const argon2 = require('argon2')
const BaseController = require('./base_controller')
const User = require('../models/user')

class Login extends BaseController {
  layout = 'layouts/authentication'

  index(request, response) {
    return response.view('login/index', {}, { layout: this.layout })
  }

  async create(request, response) {
    const hash = await argon2.hash(request.body.password)
    const user = await User.findOne({ where: { username: request.body.username }})

    if (user && await argon2.verify(user.password, request.body.password)) {
      request.session.userId = user.id

      return response.redirect('/dashboard')
    } else {
      return response.redirect('/login')
    }
  }

  delete(request, response) {
    request.session.destroy(() => response.redirect('/login'))
  }
}

module.exports = Login
