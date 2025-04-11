"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeeFactory = exports.CustomizedCoffee = exports.Cappuccino = exports.Latte = exports.Espresso = void 0;
// Classes concrètes de café
class Espresso {
    constructor() {
        this.name = "Espresso";
        this.basePrice = 2.5;
        this.id = `esp-${Date.now()}`;
        this.ingredients = new Map([
            ["café", 20], // 20g de café
            ["eau", 40], // 40ml d'eau
        ]);
    }
    getDescription() {
        return this.name;
    }
    getPrice() {
        return this.basePrice;
    }
}
exports.Espresso = Espresso;
class Latte {
    constructor() {
        this.name = "Latte";
        this.basePrice = 3.5;
        this.id = `lat-${Date.now()}`;
        this.ingredients = new Map([
            ["café", 20],
            ["eau", 40],
            ["lait", 150],
        ]);
    }
    getDescription() {
        return this.name;
    }
    getPrice() {
        return this.basePrice;
    }
}
exports.Latte = Latte;
class Cappuccino {
    constructor() {
        this.name = "Cappuccino";
        this.basePrice = 4.0;
        this.id = `cap-${Date.now()}`;
        this.ingredients = new Map([
            ["café", 20],
            ["eau", 40],
            ["lait", 100],
            ["mousse de lait", 50],
        ]);
    }
    getDescription() {
        return this.name;
    }
    getPrice() {
        return this.basePrice;
    }
}
exports.Cappuccino = Cappuccino;
// Décorateur de café - Permet d'ajouter des personnalisations
class CustomizedCoffee {
    constructor(coffee, customization) {
        this.id = coffee.id;
        this.coffee = coffee;
        this.customization = customization;
        // Ajouter ou mettre à jour les ingrédients
        for (const [ingredient, quantity] of customization.ingredients) {
            const currentQuantity = this.coffee.ingredients.get(ingredient) || 0;
            this.coffee.ingredients.set(ingredient, currentQuantity + quantity);
        }
    }
    get name() {
        return this.coffee.name;
    }
    get basePrice() {
        return this.coffee.basePrice;
    }
    get ingredients() {
        return this.coffee.ingredients;
    }
    getDescription() {
        return `${this.coffee.getDescription()} avec ${this.customization.name}`;
    }
    getPrice() {
        return this.coffee.getPrice() + this.customization.price;
    }
}
exports.CustomizedCoffee = CustomizedCoffee;
// Factory pour créer des cafés
class CoffeeFactory {
    static createCoffee(type) {
        switch (type.toLowerCase()) {
            case "espresso":
                return new Espresso();
            case "latte":
                return new Latte();
            case "cappuccino":
                return new Cappuccino();
            default:
                throw new Error(`Type de café non reconnu: ${type}`);
        }
    }
}
exports.CoffeeFactory = CoffeeFactory;
