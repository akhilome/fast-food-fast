// Responsive menu
document.querySelector('.nav-mobile').onclick = function toggleMobileMenu() {
  document.querySelector('nav ul').classList.toggle('open');
};

// Flash Messages
function flashMessage(message, type) { // eslint-disable-line
  const body = document.querySelector('body');

  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;

  messageDiv.classList.add('flash-message');

  if (type === 'success') {
    messageDiv.classList.add('flash-message_success');
  } else if (type === 'error') {
    messageDiv.classList.add('flash-message_error');
  } else {
    messageDiv.classList.add('flash-message');
  }

  body.insertBefore(messageDiv, document.querySelector('header'));
  setTimeout(() => {
    body.querySelector('.flash-message').remove();
  }, 2000);
}

// Dynamic Navigation links
try {
  const { userStatus } = (jwt_decode(localStorage.getItem('kiakiafoodToken')));

  const customerNavLinks = `
    <li><a href="menu.html">Food Menu</a></li>
    <li><a href="order-history.html">Order History</a></li>
    <li><a href="cart.html">Cart</a></li>
    <li><a id="logout" href="#">Logout</a></li>
  `;

  const adminNavLinks = `
    <li><a href="admin-menu.html">Food Menu</a></li>
    <li><a href="orders.html">Orders</a></li>
    <li><a id="logout" href="#">Logout</a></li>
  `;

  if (userStatus === 'admin') {
    document.querySelector('nav > ul').innerHTML = adminNavLinks;
  } else {
    document.querySelector('nav > ul').innerHTML = customerNavLinks;
  }
} catch (error) {
  document.querySelector('nav > ul').innerHTML = `
    <li><a href="sign-in.html">Login</a></li>
    <li><a href="sign-up.html">Sign Up</a></li>
  `;
}

// Logout
function logout() {
  localStorage.removeItem('kiakiafoodToken');
  window.location = 'index.html';
}

document.querySelector('#logout').addEventListener('click', logout);
