"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const InventoryManager_1 = require("../services/InventoryManager");
// Classe Order pour gérer les commandes
class Order {
    constructor() {
        this.coffees = [];
        this.status = "pending";
        this.totalPrice = 0;
        this.id = `order-${Date.now()}`;
        this.date = new Date();
    }
    addCoffee(coffee) {
        this.coffees.push(coffee);
        this.calculateTotal();
    }
    removeCoffee(coffeeId) {
        this.coffees = this.coffees.filter(coffee => coffee.id !== coffeeId);
        this.calculateTotal();
    }
    calculateTotal() {
        this.totalPrice = this.coffees.reduce((total, coffee) => total + coffee.getPrice(), 0);
    }
    getTotal() {
        return this.totalPrice;
    }
    async process() {
        const inventoryManager = InventoryManager_1.InventoryManager.getInstance();
        // Vérifier la disponibilité des ingrédients
        const allIngredients = new Map();
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
        }
        else {
            throw new Error("Ingrédients insuffisants pour traiter la commande");
        }
    }
}
exports.Order = Order;
