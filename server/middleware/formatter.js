const formatOrders = (orders) => {
  const formattedOrder = orders.map((foundOrder) => {
    const formatted = {
      id: foundOrder.id,
      author: foundOrder.name,
      title: foundOrder.food_name,
      date: foundOrder.date,
      status: foundOrder.status,
    };
    return formatted;
  });

  return formattedOrder;
};

export default formatOrders;
