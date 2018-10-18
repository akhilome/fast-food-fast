const url = 'https://kiakiafood.herokuapp.com/api/v1/auth/login';
const loginForm = document.querySelector('form');

function loginUser(e) {
  e.preventDefault();
  flashMessage('Logging you in ...');
  const data = {
    email: loginForm.email.value,
    password: loginForm.password.value,
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(res => res.json())
    .then((response) => {
      if (response.status !== 'success') {
        return flashMessage(response.message, 'error');
      }

      const { user } = response;
      localStorage.setItem('kiakiafoodToken', user.auth_token);
      const decoded = jwt_decode(user.auth_token);

      window.location = decoded.userStatus === 'admin' ? 'orders.html' : 'menu.html';
      return flashMessage('redirecting ...');
    })
    .catch((error) => {
      console.error(error);
      flashMessage('There was a problem logging you in', 'error');
    });
}

loginForm.addEventListener('submit', loginUser);
