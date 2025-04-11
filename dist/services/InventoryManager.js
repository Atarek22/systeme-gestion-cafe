"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryManager = void 0;
// Singleton pour gérer l'inventaire
class InventoryManager {
    constructor() {
        this.inventory = new Map(); // Ingrédient -> quantité disponible
        // Initialiser l'inventaire
        this.inventory.set("café", 1000);
        this.inventory.set("eau", 5000);
        this.inventory.set("lait", 2000);
        this.inventory.set("mousse de lait", 1000);
        this.inventory.set("sucre", 500);
        this.inventory.set("crème fouettée", 800);
    }
    static getInstance() {
        if (!InventoryManager.instance) {
            InventoryManager.instance = new InventoryManager();
        }
        return InventoryManager.instance;
    }
    async getInventory() {
        return new Map(this.inventory);
    }
    async updateInventory(ingredient, quantity) {
        const currentQuantity = this.inventory.get(ingredient) || 0;
        this.inventory.set(ingredient, currentQuantity + quantity);
    }
    async checkAvailability(ingredients) {
        for (const [ingredient, requiredQuantity] of ingredients) {
            const availableQuantity = this.inventory.get(ingredient) || 0;
            if (availableQuantity < requiredQuantity) {
                return false;
            }
        }
        return true;
    }
    async consumeIngredients(ingredients) {
        for (const [ingredient, requiredQuantity] of ingredients) {
            const availableQuantity = this.inventory.get(ingredient) || 0;
            if (availableQuantity < requiredQuantity) {
                throw new Error(`Pas assez de ${ingredient} en stock`);
            }
            this.inventory.set(ingredient, availableQuantity - requiredQuantity);
        }
    }
}
exports.InventoryManager = InventoryManager;
