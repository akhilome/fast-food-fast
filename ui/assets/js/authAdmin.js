const decoded = jwt_decode(token);

if(decoded.userStatus !== 'admin') {
  window.location = 'index.html';
}
