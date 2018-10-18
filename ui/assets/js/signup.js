const url = 'https://kiakiafood.herokuapp.com/api/v1/auth/signup';

const signupForm = document.querySelector('form');

function signUpUser(e) {
  e.preventDefault();
  if (signupForm.password.value !== signupForm['password-confirm'].value) {
    password.value = '';
    confirmPassword.value = '';
    return flashMessage('Provided passwords donot match!', 'error');
  }

  const data = {
    name: signupForm.name.value,
    email: signupForm.email.value,
    password: signupForm.password.value,
    confirmPassword: signupForm['password-confirm'].value,
    adminSecret: signupForm['admin-secret'].value,
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then((response) => {
      if (response.status !== 'success') return flashMessage(response.message, 'error');

      flashMessage('Signup successful! Logging you in ...', 'success');
      const { user } = response;

      localStorage.setItem('kiakiafoodToken', user.auth_token);
      const decoded = jwt_decode(user.auth_token);

      window.location = decoded.userStatus === 'admin' ? 'orders.html' : 'menu.html';
      return flashMessage('redirecting');
    })
    .catch((error) => {
      console.error(error);
      flashMessage('Something went wrong while signing you up', 'error');
    });
  return flashMessage('good to go!');
}

signupForm.addEventListener('submit', signUpUser);
