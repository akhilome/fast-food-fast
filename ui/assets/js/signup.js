const url = 'https://kiakiafood.herokuapp.com/api/v1/auth/signup';

const signupForm = document.querySelector('form');
const {
  name,
  email,
  password,
  ['password-confirm']: confirmPassword,
  ['admin-secret']: adminSecret,
} = signupForm;

function signUpUser(e) {
  e.preventDefault();
  if(password.value !== confirmPassword.value) {
    password.value = '';
    confirmPassword.value = '';
    return flashMessage('Provided Passwords donot match!', 'error');
  }

  const data = {
    name: name.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    adminSecret: adminSecret.value,
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(data => data.json())
    .then(response => {
      if (response.status !== 'success') return flashMessage(response.message, 'error');

      flashMessage('Signup successful! Logging you in ...', 'success');
      const { user } = response;

      localStorage.setItem('kiakiafoodToken', user.auth_token);
      const decoded = jwt_decode(user.auth_token);

      window.location = decoded.userStatus === 'admin' ? 'orders.html' : 'menu.html'
    })
    .catch(error => {
      console.error(error);
      flashMessage('Something went wrong while signing you up', 'error');
    });
}

signupForm.addEventListener('submit', signUpUser);
