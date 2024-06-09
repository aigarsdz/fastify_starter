async function authenticate(request, response) {
  if (!request.session.userId) {
    return response.redirect('/login')
  }
}

exports.authenticate = authenticate
