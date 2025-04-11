import { IndexedDBDAO } from './DAO';
import { Coffee, Espresso, Latte, Cappuccino, CustomizedCoffee } from '../models/Coffee';

// DAO pour les cafés
export class CoffeeDAO extends IndexedDBDAO<Coffee> {
  constructor() {
    super("coffees", "id");
  }

  public serialize(coffee: Coffee): any {
    // Conversion de Map en objet pour stockage
    const ingredientsObj: Record<string, number> = {};
    coffee.ingredients.forEach((value, key) => {
      ingredientsObj[key] = value;
    });

    // Déterminer le type de café
    let type = "unknown";
    if (coffee instanceof Espresso) type = "espresso";
    else if (coffee instanceof Latte) type = "latte";
    else if (coffee instanceof Cappuccino) type = "cappuccino";
    else if (coffee instanceof CustomizedCoffee) type = "customized";

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

  public deserialize(data: any): Coffee {
    // Recréer l'objet coffee approprié
    let coffee: Coffee;
    
    if (data.type === "espresso") {
      coffee = new Espresso();
    } else if (data.type === "latte") {
      coffee = new Latte();
    } else if (data.type === "cappuccino") {
      coffee = new Cappuccino();
    } else {
      // Pour les cafés personnalisés, nous utilisons un café de base et y ajoutons des descriptions
      coffee = new Espresso(); // Par défaut, utilisez Espresso comme base
    }
    
    // Reconvertir l'objet en Map
    const ingredients = new Map<string, number>();
    for (const [key, value] of Object.entries(data.ingredients)) {
      ingredients.set(key, value as number);
    }
    
    coffee.id = data.id;
    coffee.ingredients = ingredients;
    
    return coffee;
  }
}