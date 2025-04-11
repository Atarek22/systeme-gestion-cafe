import { CoffeeCustomization } from './Coffee';

// Personnalisations disponibles
export class MilkCustomization implements CoffeeCustomization {
  id: string = "milk";
  name: string = "Lait supplémentaire";
  price: number = 0.5;
  ingredients: Map<string, number> = new Map([["lait", 50]]);
}

export class SugarCustomization implements CoffeeCustomization {
  id: string = "sugar";
  name: string = "Sucre";
  price: number = 0.2;
  ingredients: Map<string, number> = new Map([["sucre", 10]]);
}

export class WhippedCreamCustomization implements CoffeeCustomization {
  id: string = "whipped-cream";
  name: string = "Crème fouettée";
  price: number = 1.0;
  ingredients: Map<string, number> = new Map([["crème fouettée", 30]]);
}