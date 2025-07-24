import argon2 from 'argon2'
import BaseController from '#controllers/base_controller'
import User from '#models/user'

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

export default Registration
