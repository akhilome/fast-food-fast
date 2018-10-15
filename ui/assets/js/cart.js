function addToCart(e) {
  if (!e.target.matches('button')) return; // event delegation
  const button = e.target;

  const cart = JSON.parse(localStorage.getItem('cart')) || {};

  const foodDetails = button.parentNode.previousElementSibling;
  const foodImage = foodDetails.parentNode.previousElementSibling.src;
  const foodId = foodDetails.dataset.foodid
  const foodName = foodDetails.querySelector('h4').innerText;
  const foodPrice = foodDetails.querySelector('p').innerText;
  
  if(!cart.hasOwnProperty(foodId)) {
    cart[foodId] = { foodName, foodPrice, foodImage }
  } else {
    return flashMessage('Item already in cart', 'error');
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  flashMessage('Item added to cart', 'success');
}

// Event Listeners
document.querySelector('section.food-menu').addEventListener('click', addToCart);
