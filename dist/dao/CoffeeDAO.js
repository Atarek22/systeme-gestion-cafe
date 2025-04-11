"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeeDAO = void 0;
const DAO_1 = require("./DAO");
const Coffee_1 = require("../models/Coffee");
// DAO pour les cafés
class CoffeeDAO extends DAO_1.IndexedDBDAO {
    constructor() {
        super("coffees", "id");
    }
    serialize(coffee) {
        // Conversion de Map en objet pour stockage
        const ingredientsObj = {};
        coffee.ingredients.forEach((value, key) => {
            ingredientsObj[key] = value;
        });
        // Déterminer le type de café
        let type = "unknown";
        if (coffee instanceof Coffee_1.Espresso)
            type = "espresso";
        else if (coffee instanceof Coffee_1.Latte)
            type = "latte";
        else if (coffee instanceof Coffee_1.Cappuccino)
            type = "cappuccino";
        else if (coffee instanceof Coffee_1.CustomizedCoffee)
            type = "customized";
        return {
            id: coffee.id,
            name: coffee.name,
            basePrice: coffee.basePrice,
            ingredients: ingredientsObj,
            description: coffee.getDescription(),
            price: coffee.getPrice(),
            type: type
        };
    }
    deserialize(data) {
        // Recréer l'objet coffee approprié
        let coffee;
        if (data.type === "espresso") {
            coffee = new Coffee_1.Espresso();
        }
        else if (data.type === "latte") {
            coffee = new Coffee_1.Latte();
        }
        else if (data.type === "cappuccino") {
            coffee = new Coffee_1.Cappuccino();
        }
        else {
            // Pour les cafés personnalisés, nous utilisons un café de base et y ajoutons des descriptions
            coffee = new Coffee_1.Espresso(); // Par défaut, utilisez Espresso comme base
        }
        // Reconvertir l'objet en Map
        const ingredients = new Map();
        for (const [key, value] of Object.entries(data.ingredients)) {
            ingredients.set(key, value);
        }
        coffee.id = data.id;
        coffee.ingredients = ingredients;
        return coffee;
    }
}
exports.CoffeeDAO = CoffeeDAO;
