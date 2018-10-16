const formatOrders = (orders) => {
  const formattedOrder = orders.map((foundOrder) => {
    const formatted = {
      id: foundOrder.id,
      author: foundOrder.name,
      items: JSON.parse(foundOrder.items),
      price: foundOrder.price,
      date: foundOrder.date,
      status: foundOrder.status,
    };
    return formatted;
  });

  return formattedOrder;
};

export default formatOrders;
