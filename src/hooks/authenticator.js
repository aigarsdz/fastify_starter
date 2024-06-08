async function authenticate(request, response) {
  if (!request.session.authenticated) {
    return response.redirect('/login')
  }
}

exports.authenticate = authenticate
