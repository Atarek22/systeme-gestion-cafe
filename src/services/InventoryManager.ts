// Singleton pour gérer l'inventaire
export class InventoryManager {
    private static instance: InventoryManager;
    private inventory: Map<string, number> = new Map(); // Ingrédient -> quantité disponible
  
    private constructor() {
      // Initialiser l'inventaire
      this.inventory.set("café", 1000);
      this.inventory.set("eau", 5000);
      this.inventory.set("lait", 2000);
      this.inventory.set("mousse de lait", 1000);
      this.inventory.set("sucre", 500);
      this.inventory.set("crème fouettée", 800);
    }
  
    public static getInstance(): InventoryManager {
      if (!InventoryManager.instance) {
        InventoryManager.instance = new InventoryManager();
      }
      return InventoryManager.instance;
    }
  
    async getInventory(): Promise<Map<string, number>> {
      return new Map(this.inventory);
    }
  
    async updateInventory(ingredient: string, quantity: number): Promise<void> {
      const currentQuantity = this.inventory.get(ingredient) || 0;
      this.inventory.set(ingredient, currentQuantity + quantity);
    }
  
    async checkAvailability(ingredients: Map<string, number>): Promise<boolean> {
      for (const [ingredient, requiredQuantity] of ingredients) {
        const availableQuantity = this.inventory.get(ingredient) || 0;
        if (availableQuantity < requiredQuantity) {
          return false;
        }
      }
      return true;
    }
  
    async consumeIngredients(ingredients: Map<string, number>): Promise<void> {
      for (const [ingredient, requiredQuantity] of ingredients) {
        const availableQuantity = this.inventory.get(ingredient) || 0;
        if (availableQuantity < requiredQuantity) {
          throw new Error(`Pas assez de ${ingredient} en stock`);
        }
        this.inventory.set(ingredient, availableQuantity - requiredQuantity);
      }
    }
  }