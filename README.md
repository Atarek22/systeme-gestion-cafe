Système de Gestion de Café
Ce projet implémente un système de gestion complet pour un café, permettant de gérer les commandes, les ingrédients et les personnalisations de cafés.
Architecture
Le système est conçu selon plusieurs patrons de conception :

Factory: Pour créer différents types de café (Espresso, Latte, Cappuccino)
Decorator: Pour ajouter des personnalisations aux cafés (lait, sucre, crème)
Singleton: Pour gérer l'inventaire des ingrédients
DAO (Data Access Object): Pour accéder aux données stockées dans IndexedDB

Diagramme de Classes

![image](https://github.com/user-attachments/assets/4d9f71ca-c5b0-49ad-96f2-03ac2c5ca92b)

Fonctionnalités

Création de différents types de cafés
Personnalisation des cafés (ajout d'ingrédients)
Gestion des commandes
Gestion de l'inventaire des ingrédients
Stockage persistant avec IndexedDB

Technologies utilisées

TypeScript
IndexedDB pour le stockage de données côté client
Async/await pour les opérations asynchrones

Installation

Clonez ce dépôt :

bashgit clone https://github.com/votre-nom/systeme-gestion-cafe.git

Installez les dépendances :

bashcd systeme-gestion-cafe
npm install

Compilez le projet TypeScript :

bashnpm run build

Démarrez l'application :

bashnpm start
Structure du projet
systeme-gestion-cafe/
├── src/
│   ├── models/
│   │   ├── Coffee.ts
│   │   ├── Customization.ts
│   │   └── Order.ts
│   ├── dao/
│   │   ├── DAO.ts
│   │   ├── CoffeeDAO.ts
│   │   └── OrderDAO.ts
│   ├── services/
│   │   ├── InventoryManager.ts
│   │   └── CafeManager.ts
│   └── index.ts
├── dist/
├── diagrams/
│   └── class-diagram.png
├── package.json
├── tsconfig.json
└── README.md
Comment utiliser
typescript// Créer une instance du gestionnaire de café
const cafeManager = new CafeManager();

// Créer un café
const espresso = await cafeManager.createCoffee("espresso");

// Personnaliser le café
const sweetEspresso = await cafeManager.customizeCoffee(espresso, "sugar");

// Créer une nouvelle commande
const order = await cafeManager.createOrder();

// Ajouter le café à la commande
await cafeManager.addCoffeeToOrder(order.id, sweetEspresso.id);

// Traiter la commande
const processedOrder = await cafeManager.processOrder(order.id);
Patrons de conception utilisés
Factory Pattern
La classe CoffeeFactory permet de créer différents types de cafés sans exposer la logique d'instanciation.
Decorator Pattern
Le CustomizedCoffee décore un objet Coffee existant avec des personnalisations supplémentaires sans modifier sa structure.
Singleton Pattern
InventoryManager garantit une instance unique pour gérer l'inventaire des ingrédients.
DAO Pattern
Les classes CoffeeDAO et OrderDAO encapsulent la logique d'accès aux données dans IndexedDB.

Auteur
TAHA EL Yacoubi
