function adminOrderCardBluePrint(orderId, customerName, foodItems = [], date, status) {
  const formattedNames = foodItems
    .map(foodName => `<p>${foodName}</p>`).join('');

  let actionButtons;

  switch (status) {
    case 'processing':
      actionButtons = '<button class="small done">mark done</button>';
      break;
    case 'cancelled':
      actionButtons = '<button class="small disabled">handled</button>';
      break;
    case 'complete':
      actionButtons = '<button class="small disabled">handled</button>';
      break;
    default:
      actionButtons = '<button class="small accept">accept</button><button class="small reject">reject</button>';
  }

  return `
    <div data-orderid="${orderId}" class="order-card">
      <div class="order-card_food-items">
        <h3>Food Item(s)</h3>
        <div class="order-card_food-items_names">${formattedNames}</div>
      </div>
      <div class="order-card_date">
        <p><strong>date:</strong></p>
        <p>${date.split('T')[0].split('-').reverse().join('/')}</p>
      </div>
      <div class="order-card_price">
        <p><strong>customer:</strong></p>
        <p>${customerName}</p>
      </div>
      <div class="order-card_admin-actions">${actionButtons}</div>
    </div>
  `;
}

const url = 'https://kiakiafood.herokuapp.com/api/v1/orders';

fetch(url, {
  headers: { 'x-auth': token },
}).then(data => data.json())
  .then((response) => {
    const { orders } = response;
    if (!orders.length) {
      document.querySelector('.admin-orders').innerHTML = '<p>No orders have been made yet!</p>';
    } else {
      const allOrders = orders
        .map(order => adminOrderCardBluePrint(
          order.id,
          order.author,
          order.items,
          order.date,
          order.status,
        ))
        .join('');

      document.querySelector('.admin-orders').innerHTML = allOrders;
    }
  })
  .catch((error) => {
    console.error(error);
    flashMessage('An error occured while fetching the orders', 'error');
    document.querySelector('.admin-orders').innerHTML = '<div></div>';
  });
