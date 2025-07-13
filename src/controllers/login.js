const argon2 = require('argon2')
const BaseController = require('./base_controller')
const User = require('../models/user')
const TwoFactorSecret = require('../models/two_factor_secret')

class Login extends BaseController {
  layout = 'layouts/authentication'
  customRoutes = [
    ['get', '/login/verify/:userID', this.verify],
    ['post', '/login/verify', this.confirmVerification]
  ]

  index(request, response) {
    return response.render('login/index', { layout: this.layout })
  }

  async create(request, response) {
    const hash = await argon2.hash(request.body.password)
    const user = User.fromUsername(request.body.username)

    if (user && await argon2.verify(user.password, request.body.password)) {
      if (user.has2FA) {
        user.twofactorSecret.setTemporaryCode()
        user.twofactorSecret.update()

        return response.redirect(`/login/verify/${user.id}`)
      }

      response.setCookie('auth_session_id', `${user.id}`, { signed: true, path: '/' })

      return response.redirect('/dashboard')
    } else {
      return response.redirect('/login')
    }
  }

  verify(request, response) {
    const twofactorSecret = new TwoFactorSecret(request.params.userID)

    return response.render('login/verify', {
      layout: this.layout,
      userID: request.params.userID,
      temporaryCode: twofactorSecret.temporaryCode
    })
  }

  confirmVerification(request, response) {
    const twofactorSecret = new TwoFactorSecret(request.body.userID)

    if (twofactorSecret.verify(request.body.totpCode, request.body.temporaryCode)) {
      response.setCookie('auth_session_id', `${request.body.userID}`, { signed: true, path: '/' })

      return response.redirect('/dashboard')
    }

    return response.redirect('/login?error=2')
  }

  delete(request, response) {
    response.clearCookie('auth_session_id')
    response.redirect('/login')
  }
}

module.exports = Login
