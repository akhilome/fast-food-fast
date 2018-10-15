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

// Populate Cart Items on Page Load
(() => {
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  if(!Object.keys(cartItems).length) {
    document.querySelector('#checkout').remove();
    return document.querySelector('section.checkout').innerHTML = '<div>No items in cart!</div>';
  }

  const formatted = Object.keys(cartItems)
    .map(food => checkoutCardBlueprint(food, cartItems[food].foodName, cartItems[food].foodPrice));

  document.querySelector('section.checkout').innerHTML = formatted.join('');
})();

//
const removeButtons = document.querySelectorAll('.food-card-checkout > button')

function removeFromCart() {
  const cart = JSON.parse(localStorage.getItem('cart'));
  const foodCard = this.parentNode;
  const foodId = foodCard.dataset.foodid;
  delete cart[foodId];

  localStorage.setItem('cart', JSON.stringify(cart));
  foodCard.remove();
}

removeButtons.forEach(button => button.addEventListener('click', removeFromCart));