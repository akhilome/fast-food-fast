// Admins should always default to the admin-menu page
try {
  const { userStatus } = (jwt_decode(localStorage.getItem('kiakiafoodToken')));
  if (userStatus === 'admin') {
    window.location = 'admin-menu.html';
  }
} catch (error) {
  console.error(error);
}
