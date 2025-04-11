import { Coffee } from './Coffee';
import { InventoryManager } from '../services/InventoryManager';

// Classe Order pour gérer les commandes
export class Order {
  id: string;
  coffees: Coffee[] = [];
  date: Date;
  status: "pending" | "completed" | "cancelled" = "pending";
  totalPrice: number = 0;

  constructor() {
    this.id = `order-${Date.now()}`;
    this.date = new Date();
  }

  addCoffee(coffee: Coffee): void {
    this.coffees.push(coffee);
    this.calculateTotal();
  }

  removeCoffee(coffeeId: string): void {
    this.coffees = this.coffees.filter(coffee => coffee.id !== coffeeId);
    this.calculateTotal();
  }

  private calculateTotal(): void {
    this.totalPrice = this.coffees.reduce((total, coffee) => total + coffee.getPrice(), 0);
  }

  getTotal(): number {
    return this.totalPrice;
  }

  async process(): Promise<void> {
    const inventoryManager = InventoryManager.getInstance();
    
    // Vérifier la disponibilité des ingrédients
    const allIngredients = new Map<string, number>();
    for (const coffee of this.coffees) {
      for (const [ingredient, quantity] of coffee.ingredients) {
        const currentQuantity = allIngredients.get(ingredient) || 0;
        allIngredients.set(ingredient, currentQuantity + quantity);
      }
    }
    
    // Consommer les ingrédients si disponibles
    if (await inventoryManager.checkAvailability(allIngredients)) {
      await inventoryManager.consumeIngredients(allIngredients);
      this.status = "completed";
    } else {
      throw new Error("Ingrédients insuffisants pour traiter la commande");
    }
  }
}