export async function authenticate(request, response) {
  if (!request.cookies.auth_session_id) {
    return response.redirect('/login')
  }

  const cookie = request.unsignCookie(request.cookies.auth_session_id)

  if (!cookie.valid) {
    return response.redirect('/login')
  }
}
