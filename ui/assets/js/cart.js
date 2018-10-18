function addToCart(e) {
  if (!e.target.matches('button')) return; // event delegation
  const button = e.target;

  // Prevent unauthenticated customer from adding to cart
  try {
    const token = localStorage.getItem('kiakiafoodToken');
    jwt_decode(token);
    if (!token) throw new Error();
  } catch (error) {
    window.location = 'sign-in.html';
    return;
  }


  const cart = JSON.parse(localStorage.getItem('cart')) || {};

  const foodDetails = button.parentNode.previousElementSibling;
  const foodImage = foodDetails.parentNode.previousElementSibling.src;
  const foodId = foodDetails.dataset.foodid;
  const foodName = foodDetails.querySelector('h4').innerText;
  const foodPrice = foodDetails.querySelector('p').innerText;

  if (!Object.keys(cart).includes(foodId)) {
    cart[foodId] = { foodName, foodPrice, foodImage };
  } else {
    flashMessage('Item already in cart', 'error');
    return;
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  flashMessage('Item added to cart', 'success');
}

// Event Listeners
document.querySelector('section.food-menu').addEventListener('click', addToCart);
