const argon2 = require('argon2')
const BaseController = require('./base_controller')
const User = require('../models/user')

class Registration extends BaseController {
  layout = 'layouts/authentication'

  index(request, response) {
    return response.render('registration/index', { layout: this.layout })
  }

  async create(request, response) {
    const user = new User()

    user.username = request.body.username.trim()
    user.password = await argon2.hash(request.body.password)

    try {
      user.create()
      response.setCookie('auth_session_id', `${user.id}`, { signed: true })

      return response.redirect('/dashboard')
    } catch (error) {
      request.log.error(error)

      return response.redirect('/registration')
    }
  }
}

module.exports = Registration
