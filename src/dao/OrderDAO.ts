import { IndexedDBDAO } from './DAO';
import { Order } from '../models/Order';
import { CoffeeDAO } from './CoffeeDAO';

// DAO pour les commandes
export class OrderDAO extends IndexedDBDAO<Order> {
  constructor() {
    super("orders", "id");
  }

  protected serialize(order: Order): any {
    const coffeeDAO = new CoffeeDAO();
    
    return {
      id: order.id,
      coffees: order.coffees.map(coffee => coffeeDAO.serialize(coffee)),
      date: order.date.toISOString(),
      status: order.status,
      totalPrice: order.totalPrice
    };
  }

  protected deserialize(data: any): Order {
    const order = new Order();
    const coffeeDAO = new CoffeeDAO();
    
    order.id = data.id;
    order.coffees = data.coffees.map((coffeeData: any) => coffeeDAO.deserialize(coffeeData));
    order.date = new Date(data.date);
    order.status = data.status;
    order.totalPrice = data.totalPrice;
    
    return order;
  }
}