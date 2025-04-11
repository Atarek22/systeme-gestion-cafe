import { Coffee } from '../models/Coffee';
import { CoffeeFactory } from '../models/Coffee';
import { CustomizedCoffee } from '../models/Coffee';
import { MilkCustomization, SugarCustomization, WhippedCreamCustomization } from '../models/Customization';
import { Order } from '../models/Order';
import { CoffeeDAO } from '../dao/CoffeeDAO';
import { OrderDAO } from '../dao/OrderDAO';
import { InventoryManager } from './InventoryManager';

// Classe de gestion globale du système
export class CafeManager {
  private coffeeDAO: CoffeeDAO;
  private orderDAO: OrderDAO;
  private inventoryManager: InventoryManager;

  constructor() {
    this.coffeeDAO = new CoffeeDAO();
    this.orderDAO = new OrderDAO();
    this.inventoryManager = InventoryManager.getInstance();
  }

  async createCoffee(type: string): Promise<Coffee> {
    const coffee = CoffeeFactory.createCoffee(type);
    return await this.coffeeDAO.create(coffee);
  }

  async customizeCoffee(coffee: Coffee, customizationId: string): Promise<Coffee> {
    let customization;
    
    switch (customizationId) {
      case "milk":
        customization = new MilkCustomization();
        break;
      case "sugar":
        customization = new SugarCustomization();
        break;
      case "whipped-cream":
        customization = new WhippedCreamCustomization();
        break;
      default:
        throw new Error(`Personnalisation non reconnue: ${customizationId}`);
    }
    
    const customizedCoffee = new CustomizedCoffee(coffee, customization);
    return await this.coffeeDAO.update(coffee.id, customizedCoffee);
  }

  async createOrder(): Promise<Order> {
    const order = new Order();
    return await this.orderDAO.create(order);
  }

  async addCoffeeToOrder(orderId: string, coffeeId: string): Promise<Order> {
    const order = await this.orderDAO.findById(orderId);
    const coffee = await this.coffeeDAO.findById(coffeeId);
    
    if (!order || !coffee) {
      throw new Error("Commande ou café introuvable");
    }
    
    order.addCoffee(coffee);
    return await this.orderDAO.update(orderId, order);
  }

  async processOrder(orderId: string): Promise<Order> {
    const order = await this.orderDAO.findById(orderId);
    
    if (!order) {
      throw new Error("Commande introuvable");
    }
    
    await order.process();
    return await this.orderDAO.update(orderId, order);
  }

  async getOrderHistory(): Promise<Order[]> {
    return await this.orderDAO.findAll();
  }

  async getInventory(): Promise<Map<string, number>> {
    return await this.inventoryManager.getInventory();
  }
}