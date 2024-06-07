const BaseController = require('./base_controller')

class Home extends BaseController {
  index(request, response) {
    response.view('home/index', {}, { layout: this.layout })
  }
}

module.exports = Home
