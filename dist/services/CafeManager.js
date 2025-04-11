"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CafeManager = void 0;
const Coffee_1 = require("../models/Coffee");
const Coffee_2 = require("../models/Coffee");
const Customization_1 = require("../models/Customization");
const Order_1 = require("../models/Order");
const CoffeeDAO_1 = require("../dao/CoffeeDAO");
const OrderDAO_1 = require("../dao/OrderDAO");
const InventoryManager_1 = require("./InventoryManager");
// Classe de gestion globale du système
class CafeManager {
    constructor() {
        this.coffeeDAO = new CoffeeDAO_1.CoffeeDAO();
        this.orderDAO = new OrderDAO_1.OrderDAO();
        this.inventoryManager = InventoryManager_1.InventoryManager.getInstance();
    }
    async createCoffee(type) {
        const coffee = Coffee_1.CoffeeFactory.createCoffee(type);
        return await this.coffeeDAO.create(coffee);
    }
    async customizeCoffee(coffee, customizationId) {
        let customization;
        switch (customizationId) {
            case "milk":
                customization = new Customization_1.MilkCustomization();
                break;
            case "sugar":
                customization = new Customization_1.SugarCustomization();
                break;
            case "whipped-cream":
                customization = new Customization_1.WhippedCreamCustomization();
                break;
            default:
                throw new Error(`Personnalisation non reconnue: ${customizationId}`);
        }
        const customizedCoffee = new Coffee_2.CustomizedCoffee(coffee, customization);
        return await this.coffeeDAO.update(coffee.id, customizedCoffee);
    }
    async createOrder() {
        const order = new Order_1.Order();
        return await this.orderDAO.create(order);
    }
    async addCoffeeToOrder(orderId, coffeeId) {
        const order = await this.orderDAO.findById(orderId);
        const coffee = await this.coffeeDAO.findById(coffeeId);
        if (!order || !coffee) {
            throw new Error("Commande ou café introuvable");
        }
        order.addCoffee(coffee);
        return await this.orderDAO.update(orderId, order);
    }
    async processOrder(orderId) {
        const order = await this.orderDAO.findById(orderId);
        if (!order) {
            throw new Error("Commande introuvable");
        }
        await order.process();
        return await this.orderDAO.update(orderId, order);
    }
    async getOrderHistory() {
        return await this.orderDAO.findAll();
    }
    async getInventory() {
        return await this.inventoryManager.getInventory();
    }
}
exports.CafeManager = CafeManager;
