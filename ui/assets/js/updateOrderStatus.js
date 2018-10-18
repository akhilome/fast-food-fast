const orders = document.querySelector('.admin-orders');

function updateOrderStatus(e) {
  if (!e.target.matches('button')) return;

  const buttonAction = e.target.classList[1];
  const orderCard = e.target.parentNode.parentNode;
  const orderId = Number(orderCard.dataset.orderid);

  if (buttonAction === 'disabled') {
    flashMessage('That order has been handled already');
    return;
  }

  let newStatus;

  if (buttonAction === 'accept') {
    newStatus = 'processing';
  } else if (buttonAction === 'reject') {
    newStatus = 'cancelled';
  } else {
    newStatus = 'complete';
  }

  fetch(`https://kiakiafood.herokuapp.com/api/v1/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      'x-auth': token,
    },
    body: JSON.stringify({ status: newStatus }),
  }).then(data => data.json())
    .then((response) => {
      if (response.status !== 'success') return flashMessage(response.message, 'error');

      const newActionButton = response.order.status === 'processing'
        ? '<button class="small done">mark done</button>'
        : '<button class="small disabled">handled</button>';

      orderCard.querySelector('.order-card_admin-actions').innerHTML = newActionButton;

      return flashMessage('Order status updated successfully!', 'success');
    })
    .catch((error) => {
      console.error(error);
      flashMessage('Something went wrong while updating order status', 'error');
    });
}

orders.addEventListener('click', updateOrderStatus);
