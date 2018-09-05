import todaysDate from '../utils/date';

class Order {
  constructor(id, author, food) {
    this.id = id;
    this.author = author;
    this.title = food;
    this.status = 'pending';
    this.date = todaysDate();
  }
}

export default Order;
