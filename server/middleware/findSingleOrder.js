import orders from '../db/orders';

const findOrder = (req, res, next) => {
  let { id } = req.params;
  id = Number(id);
  req.order = orders.find(order => order.id === id);
  req.orderIndex = orders.findIndex(order => order.id === id);
  next();
};

export default findOrder;
