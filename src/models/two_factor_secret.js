import * as OTPAuth from 'otpauth'
import QRCode from 'qrcode'
import database from '#database'
import BaseModel from '#models/base_model'

class TwoFactorSecret extends BaseModel {
  id = 0
  userID = 0
  code = ''
  temporaryCode = null
  createdAt = null
  updatedAt = null

  constructor(userID) {
    super()

    if (userID) {
      const existingEntry = database.prepare('SELECT * FROM two_factor_secrets WHERE userID = ?').get(userID)

      this.assignValues(existingEntry)
    }
  }

  create() {
    if (this.id > 0) {
      throw new Error('A TwoFactorSecret that has a valid ID cannot be created again.')
    }

    const date = new Date()
    const dateValue = date.toISOString().replace('T', ' ').split('.')[0]

    this.updatedAt = dateValue
    this.createdAt = dateValue

    const result = database.prepare(
      'INSERT INTO two_factor_secrets (userID, code, createdAt, updatedAt) VALUES (?, ?, ?, ?) RETURNING id'
    ).get(this.userID, this.code, this.createdAt, this.updatedAt)

    this.id = result.id
  }

  update() {
    database.prepare('UPDATE two_factor_secrets SET temporaryCode = ? WHERE id = ?').run(this.temporaryCode, this.id)
  }

  delete() {
    database.prepare('DELETE FROM two_factor_secrets WHERE id = ?').run(this.id)
  }

  verify(totpCode, temporaryCode) {
    if (temporaryCode == this.temporaryCode) {
      return this.verifyWithoutTemporaryCode(totpCode)
    }

    return false
  }

  verifyWithoutTemporaryCode(totpCode) {
    const totp = new OTPAuth.TOTP({
      issuer: 'FastifyStarter',
      label: 'FastifyStarter',
      secret: OTPAuth.Secret.fromBase32(this.code)
    })

    const delta = totp.validate({ token: totpCode, window: 1 })

    if (delta === 0) {
      this.clearTemporaryCode()
      this.update()

      return true
    }

    return false
  }

  setTemporaryCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let code = ''

    for (var i = 0; i < 12; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    this.temporaryCode = code
  }

  clearTemporaryCode() {
    this.temporaryCode = null
  }

  async getQRCode() {
    const totp = new OTPAuth.TOTP({
      issuer: 'FastifyStarter',
      label: 'FastifyStarter',
      secret: OTPAuth.Secret.fromBase32(this.code)
    })
    const uri = totp.toString()

    return await QRCode.toDataURL(uri)
  }

  static createForUser(userID) {
    const twoFactorSecret = new TwoFactorSecret()
    const totpCode = new OTPAuth.Secret({ size: 20 })

    twoFactorSecret.userID = userID
    twoFactorSecret.code = totpCode.base32

    twoFactorSecret.create()

    return twoFactorSecret
  }
}

export default TwoFactorSecret