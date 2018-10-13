// Get all buttons
const buyButtons = document.querySelectorAll('.food-details__action > button');

function addToCart() {
  if(!localStorage.getItem('cart')) localStorage.setItem('cart', '{}');
  const cart = JSON.parse(localStorage.getItem('cart'));
  const foodDetails = this.parentNode.previousElementSibling;
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
buyButtons.forEach(button => button.addEventListener('click', addToCart));