function orderCardBluePrint(foodNames = [], orderPrice, date, status) {
  const formattedNames = foodNames
    .map(foodName => `<p>${foodName}</p>`).join('');

  let orderStatus;

  switch (status) {
    case 'processing':
      orderStatus = 'progress';
      break;
    case 'cancelled':
      orderStatus = 'rejected';
      break;
    case 'complete':
      orderStatus = 'completed';
      break;
    default:
      orderStatus = 'new';
  }

  return `
    <div class="order-card">
      <div class="order-card_food-items">
        <h3>Food Item(s)</h3>
        <div class="order-card_food-items_names">${formattedNames}</div>
      </div>
      <div class="order-card_price">
        <p><strong>price:</strong></p>
        <p>₦${orderPrice.toLocaleString()}</p>
      </div>
      <div class="order-card_date">
        <p><strong>date:</strong></p>
        <p>${date.split('T')[0].split('-').reverse().join('/')}</p>
      </div>
      <div class="order-status-${orderStatus}"></div>
    </div>
  `;
}

let decodedUserId;
try {
  decodedUserId = (jwt_decode(token)).userId;
} catch (error) {
  console.error(error);
}

const url = `https://kiakiafood.herokuapp.com/api/v1/users/${decodedUserId}/orders`;

fetch(url, {
  headers: { 'x-auth': token },
}).then(data => data.json())
  .then((response) => {
    if (!response.orders.length) {
      document.querySelector('.order-history').innerHTML = '<p>You have not made any orders yet!</p>';
    } else {
      const allUserOrders = response.orders
        .map(order => orderCardBluePrint(order.items, order.price, order.date, order.status))
        .join('');
      document.querySelector('.order-history').innerHTML = allUserOrders;
    }
  })
  .catch((error) => {
    console.error(error);
    flashMessage('An error occured while fetching your order history', 'error');
    document.querySelector('.order-history').innerHTML = '<div></div>';
  });
