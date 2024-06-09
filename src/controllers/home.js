const BaseController = require('./base_controller')

class Home extends BaseController {
  index(request, response) {
    return response.view('home/index', {}, { layout: this.layout })
  }
}

module.exports = Home
