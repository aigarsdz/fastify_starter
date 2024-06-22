const argon2 = require('argon2')
const BaseController = require('./base_controller')
const { authenticate } = require('../hooks/authenticator')
const User = require('../models/user')

class Users extends BaseController {
  urlPath = '/dashboard/users'
  beforeAll = [authenticate]

  async index(request, response) {
    const users = await User.findAll()

    return response.view('users/index', { users }, { layout: this.layout })
  }

  new(request, response) {
    return response.view('users/new', {}, { layout: this.layout })
  }

  async create(request, response) {
    const passwordHash = await argon2.hash(request.body.password)
    const user = await User.create({ username: request.body.username, password: passwordHash })

    return response.redirect('/dashboard/users')
  }
}

module.exports = Users
