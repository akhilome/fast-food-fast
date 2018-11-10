/**
 * @function formatOrders - takes an array of orders from gotten from
 * the database and formats them according to the API documentation.
 * @param {Object[]} orders - an array of orders to be formatted
 * @returns {Object[]} - the formatted array of orders, per the docs
 */
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
