const token = localStorage.getItem('kiakiafoodToken');
if (!token) {
  window.location = 'sign-in.html';
}

try {
  jwt_decode(token);
} catch (error) {
  window.location = 'sign-in.html';
}
