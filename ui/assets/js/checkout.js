function checkoutCardBlueprint(id, foodName, foodPrice) {
  return `
  <div data-foodid=${id} class="food-card-checkout">
    <div class="food-card-checkout__details">
      <h4>${foodName}</h4>
      <p>${foodPrice}</p>
    </div>
    <button>Remove</button>
  </div>
  `;
}

// compute order price
const orderPrice = () => {
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  // if (!Object.keys(cartItems).length) return;

  return Object.keys(cartItems)
    .map(foodId => cartItems[foodId].foodPrice)
    .map(price => Number(price.split(',').join('').substr(1)))
    .reduce((accum, current) => accum + current)
    .toLocaleString();
}

// Populate Cart Items on Page Load
(() => {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || {};
  if(!Object.keys(cartItems).length) {
    document.querySelector('#checkout').remove();
    document.querySelector('.order-price').remove();
    return document.querySelector('section.checkout').innerHTML = '<div>No items in cart!</div>';
  }

  const formatted = Object.keys(cartItems)
    .map(food => checkoutCardBlueprint(food, cartItems[food].foodName, cartItems[food].foodPrice));

  document.querySelector('section.checkout').innerHTML = formatted.join('');
  document.querySelector('#order-price').textContent = orderPrice();
})();

// Removing items from cart
const removeButtons = document.querySelectorAll('.food-card-checkout > button')

function removeFromCart() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const foodCard = this.parentNode;
  const foodId = foodCard.dataset.foodid;
  delete cart[foodId];

  localStorage.setItem('cart', JSON.stringify(cart));

  if (!Object.keys(cart).length) {
    document.querySelector('.order-price').remove();
    document.querySelector('#checkout').remove();
    return document.querySelector('section.checkout').innerHTML = '<div>No items in cart!</div>';
  }

  foodCard.remove();
  document.querySelector('#order-price').textContent = orderPrice();
}

removeButtons.forEach(button => button.addEventListener('click', removeFromCart));

// Initiate actual checkout
let wrapper = document.querySelector('.wrapper');

function buyFoodItems(e) {
  if (!e.target.matches('#checkout')) return;

  const foodIds = Object.keys(JSON.parse(localStorage.getItem('cart'))).map(Number);
  flashMessage('placing your order ...');

  const url = 'https://kiakiafood.herokuapp.com/api/v1/orders';
  const token = localStorage.getItem('kiakiafoodToken');

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': token
    },
    body: JSON.stringify({ foodIds })
  })
    .then(data => data.json())
    .then(response => {
      if (response.status !== 'success') return flashMessage(response.message, 'error');
      flashMessage('Order placed!', 'success');
      localStorage.removeItem('cart');
      setTimeout(() => {
        window.location = 'order-history.html';
      }, 2000);
    })
    .catch(error => {
      console.error(error);
      flashMessage('Something went wrong while placing your order', 'error');
    });
}

wrapper.addEventListener('click', buyFoodItems);
