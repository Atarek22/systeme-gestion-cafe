"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhippedCreamCustomization = exports.SugarCustomization = exports.MilkCustomization = void 0;
// Personnalisations disponibles
class MilkCustomization {
    constructor() {
        this.id = "milk";
        this.name = "Lait supplémentaire";
        this.price = 0.5;
        this.ingredients = new Map([["lait", 50]]);
    }
}
exports.MilkCustomization = MilkCustomization;
class SugarCustomization {
    constructor() {
        this.id = "sugar";
        this.name = "Sucre";
        this.price = 0.2;
        this.ingredients = new Map([["sucre", 10]]);
    }
}
exports.SugarCustomization = SugarCustomization;
class WhippedCreamCustomization {
    constructor() {
        this.id = "whipped-cream";
        this.name = "Crème fouettée";
        this.price = 1.0;
        this.ingredients = new Map([["crème fouettée", 30]]);
    }
}
exports.WhippedCreamCustomization = WhippedCreamCustomization;
