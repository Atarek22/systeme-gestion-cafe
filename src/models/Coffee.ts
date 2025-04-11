// Interface de base pour tous les cafés
export interface Coffee {
    id: string;
    name: string;
    basePrice: number;
    ingredients: Map<string, number>; // Ingrédient -> quantité
    getDescription(): string;
    getPrice(): number;
  }
  
  // Classes concrètes de café
  export class Espresso implements Coffee {
    id: string;
    name: string = "Espresso";
    basePrice: number = 2.5;
    ingredients: Map<string, number>;
  
    constructor() {
      this.id = `esp-${Date.now()}`;
      this.ingredients = new Map<string, number>([
        ["café", 20], // 20g de café
        ["eau", 40], // 40ml d'eau
      ]);
    }
  
    getDescription(): string {
      return this.name;
    }
  
    getPrice(): number {
      return this.basePrice;
    }
  }
  
  export class Latte implements Coffee {
    id: string;
    name: string = "Latte";
    basePrice: number = 3.5;
    ingredients: Map<string, number>;
  
    constructor() {
      this.id = `lat-${Date.now()}`;
      this.ingredients = new Map<string, number>([
        ["café", 20],
        ["eau", 40],
        ["lait", 150],
      ]);
    }
  
    getDescription(): string {
      return this.name;
    }
  
    getPrice(): number {
      return this.basePrice;
    }
  }
  
  export class Cappuccino implements Coffee {
    id: string;
    name: string = "Cappuccino";
    basePrice: number = 4.0;
    ingredients: Map<string, number>;
  
    constructor() {
      this.id = `cap-${Date.now()}`;
      this.ingredients = new Map<string, number>([
        ["café", 20],
        ["eau", 40],
        ["lait", 100],
        ["mousse de lait", 50],
      ]);
    }
  
    getDescription(): string {
      return this.name;
    }
  
    getPrice(): number {
      return this.basePrice;
    }
  }
  
  // Décorateur de café - Permet d'ajouter des personnalisations
  export class CustomizedCoffee implements Coffee {
    id: string;
    private coffee: Coffee;
    private customization: CoffeeCustomization;
  
    constructor(coffee: Coffee, customization: CoffeeCustomization) {
      this.id = coffee.id;
      this.coffee = coffee;
      this.customization = customization;
      
      // Ajouter ou mettre à jour les ingrédients
      for (const [ingredient, quantity] of customization.ingredients) {
        const currentQuantity = this.coffee.ingredients.get(ingredient) || 0;
        this.coffee.ingredients.set(ingredient, currentQuantity + quantity);
      }
    }
  
    get name(): string {
      return this.coffee.name;
    }
  
    get basePrice(): number {
      return this.coffee.basePrice;
    }
  
    get ingredients(): Map<string, number> {
      return this.coffee.ingredients;
    }
  
    getDescription(): string {
      return `${this.coffee.getDescription()} avec ${this.customization.name}`;
    }
  
    getPrice(): number {
      return this.coffee.getPrice() + this.customization.price;
    }
  }
  
  // Factory pour créer des cafés
  export class CoffeeFactory {
    static createCoffee(type: string): Coffee {
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
  
  // Interface pour les personnalisations de café
  export interface CoffeeCustomization {
    id: string;
    name: string;
    price: number;
    ingredients: Map<string, number>; // Ingrédient -> quantité
  }