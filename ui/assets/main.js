// Responsive menu
document.querySelector('.nav-mobile').onclick = function() {
  document.querySelector('nav ul').classList.toggle('open');
}

// Flash Messages
function flashMessage(message, type) {
  const body = document.querySelector('body');

  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;

  messageDiv.classList.add('flash-message');

  if (type === 'success') {
    messageDiv.classList.add('flash-message_success');
  } else if (type === 'error') {
    messageDiv.classList.add('flash-message_error')
  } else {
    messageDiv.classList.add('flash-message');
  }

  body.insertBefore(messageDiv, document.querySelector('header'));
  setTimeout(() => {
    body.querySelector('.flash-message').remove();
  }, 2000);
}
