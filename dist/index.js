"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CafeManager_1 = require("./services/CafeManager");
// Exemple d'utilisation 
async function main() {
    const cafeManager = new CafeManager_1.CafeManager();
    try {
        console.log("Création d'un espresso...");
        const espresso = await cafeManager.createCoffee("espresso");
        console.log(`Café créé: ${espresso.getDescription()} - ${espresso.getPrice()}€`);
        console.log("Ajout de sucre à l'espresso...");
        const sweetEspresso = await cafeManager.customizeCoffee(espresso, "sugar");
        console.log(`Café personnalisé: ${sweetEspresso.getDescription()} - ${sweetEspresso.getPrice()}€`);
        console.log("Création d'une nouvelle commande...");
        const order = await cafeManager.createOrder();
        console.log(`Commande créée: ${order.id}`);
        console.log("Ajout du café à la commande...");
        await cafeManager.addCoffeeToOrder(order.id, sweetEspresso.id);
        console.log("Création d'un latte avec de la crème fouettée...");
        const latte = await cafeManager.createCoffee("latte");
        const fancyLatte = await cafeManager.customizeCoffee(latte, "whipped-cream");
        console.log(`Café personnalisé: ${fancyLatte.getDescription()} - ${fancyLatte.getPrice()}€`);
        console.log("Ajout du latte à la commande...");
        await cafeManager.addCoffeeToOrder(order.id, fancyLatte.id);
        console.log("Traitement de la commande...");
        const processedOrder = await cafeManager.processOrder(order.id);
        console.log(`Commande traitée: ${processedOrder.status}`);
        console.log(`Total: ${processedOrder.getTotal()}€`);
        console.log("Vérification de l'inventaire après la commande...");
        const inventory = await cafeManager.getInventory();
        inventory.forEach((quantity, ingredient) => {
            console.log(`${ingredient}: ${quantity}`);
        });
    }
    catch (error) {
        console.error("Erreur:", error);
    }
}
// Exécution du programme principal
main();
