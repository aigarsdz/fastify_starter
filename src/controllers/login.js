const argon2 = require('argon2')
const BaseController = require('./base_controller')

class Login extends BaseController {
  index(request, response) {
    response.view('login/index', {}, { layout: this.layout })
  }

  async create(request, response) {
    const hash = await argon2.hash(request.body.password)

    request.session.authenticated = true

    response.redirect('/dashboard')
  }

  delete(request, response) {
    request.session.destroy(() => response.redirect('/login'))
  }
}

module.exports = Login
