export async function authenticate(request, response) {
  if (!request.cookies.auth_session_id) {
    return response.redirect('/login')
  }
}
