import BaseController from '#base_controller'

class Home extends BaseController {
  layout = 'layouts/authentication'

  index(request, response) {
    return response.render('home/index', { layout: this.layout })
  }
}

export default Home
