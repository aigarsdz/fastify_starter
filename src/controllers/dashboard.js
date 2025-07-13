const BaseController = require('./base_controller')
const { authenticate } = require('../hooks/authenticator')
const User = require('../models/user')
const TwoFactorSecret = require('../models/two_factor_secret')

class Dashboard extends BaseController {
  hooks = {
    preHandler: authenticate
  }

  customRoutes = [
    ['get', '/dashboard/settings', this.settings],
    ['get', '/dashboard/settings/enable-2fa', this.twoFactorAuthSetup],
    ['post', '/dashboard/settings/enable-2fa', this.enable2FA],
    ['post', '/dashboard/settings/disable-2fa', this.disable2FA]
  ]

  index(request, response) {
    const cookie = request.unsignCookie(request.cookies.auth_session_id)
    const user = new User(Number(cookie.value))

    return response.render('dashboard/index', { user })
  }

  settings(request, response) {
    const cookie = request.unsignCookie(request.cookies.auth_session_id)
    const user = new User(Number(cookie.value))

    return response.render('dashboard/settings', { user })
  }

  async twoFactorAuthSetup(request, response) {
    const cookie = request.unsignCookie(request.cookies.auth_session_id)
    const twofactorSecret = TwoFactorSecret.createForUser(Number(cookie.value))
    const qrCode = await twofactorSecret.getQRCode()

    return response.render('dashboard/enable2fa', { qrCode })
  }

  enable2FA(request, response) {
    const cookie = request.unsignCookie(request.cookies.auth_session_id)
    const user = new User(Number(cookie.value))

    if (user.twoFactorSecret.verifyWithoutTemporaryCode(request.body.totpCode)) {
      user.twoFactorAuthEnabled = 1

      user.update()

      return response.redirect('/dashboard/settings')
    }

    return response.redirect('/dashboard?error=1')
  }

  disable2FA(request, response) {
    const cookie = request.unsignCookie(request.cookies.auth_session_id)
    const user = new User(Number(cookie.value))

    user.twoFactorSecret.delete()

    user.twoFactorAuthEnabled = 0

    user.update()

    return response.redirect('/dashboard/settings')
  }
}

module.exports = Dashboard
