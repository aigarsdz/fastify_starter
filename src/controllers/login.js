const argon2 = require('argon2')
const BaseController = require('./base_controller')
const User = require('../models/user')

class Login extends BaseController {
  layout = 'layouts/authentication'

  index(request, response) {
    return response.render('login/index', { layout: this.layout })
  }

  async create(request, response) {
    const hash = await argon2.hash(request.body.password)

    let user = null

    try  {
      user = User.fromUsername(request.body.username)
    } catch (error) {
      request.log.error(error)
    }

    if (user && await argon2.verify(user.password, request.body.password)) {
      response.setCookie('auth_session_id', `${user.id}`, { signed: true })

      return response.redirect('/dashboard')
    } else {
      return response.redirect('/login')
    }
  }

  delete(request, response) {
    response.clearCookie('auth_session_id')
    response.redirect('/login')
  }
}

module.exports = Login
