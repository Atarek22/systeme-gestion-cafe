"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderDAO = void 0;
const DAO_1 = require("./DAO");
const Order_1 = require("../models/Order");
const CoffeeDAO_1 = require("./CoffeeDAO");
// DAO pour les commandes
class OrderDAO extends DAO_1.IndexedDBDAO {
    constructor() {
        super("orders", "id");
    }
    serialize(order) {
        const coffeeDAO = new CoffeeDAO_1.CoffeeDAO();
        return {
            id: order.id,
            coffees: order.coffees.map(coffee => coffeeDAO.serialize(coffee)),
            date: order.date.toISOString(),
            status: order.status,
            totalPrice: order.totalPrice
        };
    }
    deserialize(data) {
        const order = new Order_1.Order();
        const coffeeDAO = new CoffeeDAO_1.CoffeeDAO();
        order.id = data.id;
        order.coffees = data.coffees.map((coffeeData) => coffeeDAO.deserialize(coffeeData));
        order.date = new Date(data.date);
        order.status = data.status;
        order.totalPrice = data.totalPrice;
        return order;
    }
}
exports.OrderDAO = OrderDAO;
