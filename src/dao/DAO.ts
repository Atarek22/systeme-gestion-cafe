import "fake-indexeddb/auto";

// Interface DAO générique
export interface DAO<T> {
  create(item: T): Promise<T>;
  update(id: string, item: T): Promise<T>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

// Classe abstraite pour gérer la connexion à IndexedDB
export abstract class IndexedDBDAO<T> implements DAO<T> {
  protected dbName: string = "CafeManagementDB";
  protected dbVersion: number = 1;
  protected storeName: string;
  protected keyPath: string;
  
  // Registre statique de tous les magasins d'objets
  private static allStores: {storeName: string, keyPath: string}[] = [];

  constructor(storeName: string, keyPath: string) {
    this.storeName = storeName;
    this.keyPath = keyPath;
    
    // Enregistrer ce magasin pour la création ultérieure
    const existingStore = IndexedDBDAO.allStores.find(s => s.storeName === storeName);
    if (!existingStore) {
      IndexedDBDAO.allStores.push({ storeName, keyPath });
    }
  }

  protected async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Créer tous les magasins d'objets enregistrés
        IndexedDBDAO.allStores.forEach(store => {
          if (!db.objectStoreNames.contains(store.storeName)) {
            console.log(`Création du magasin d'objets: ${store.storeName}`);
            db.createObjectStore(store.storeName, { keyPath: store.keyPath });
          }
        });
      };
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Vérification supplémentaire: si le magasin n'existe pas, recréer la base de données
        if (!db.objectStoreNames.contains(this.storeName)) {
          console.log(`Le magasin ${this.storeName} n'existe pas. Mise à niveau de la base de données...`);
          db.close();
          // Augmenter la version pour forcer une mise à niveau
          const newVersion = this.dbVersion + 1;
          console.log(`Tentative d'ouverture avec la version ${newVersion}`);
          const newRequest = indexedDB.open(this.dbName, newVersion);
          
          newRequest.onupgradeneeded = (upgradeEvent) => {
            const newDb = (upgradeEvent.target as IDBOpenDBRequest).result;
            if (!newDb.objectStoreNames.contains(this.storeName)) {
              console.log(`Création du magasin manquant: ${this.storeName}`);
              newDb.createObjectStore(this.storeName, { keyPath: this.keyPath });
            }
          };
          
          newRequest.onsuccess = (successEvent) => {
            resolve((successEvent.target as IDBOpenDBRequest).result);
          };
          
          newRequest.onerror = (errorEvent) => {
            reject(`Erreur lors de la mise à niveau: ${(errorEvent.target as IDBOpenDBRequest).error}`);
          };
        } else {
          resolve(db);
        }
      };
      
      request.onerror = (event) => {
        reject(`Erreur d'ouverture de la base de données: ${(event.target as IDBOpenDBRequest).error}`);
      };
    });
  }

  async create(item: T): Promise<T> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.add(this.serialize(item));
      
      request.onsuccess = () => {
        resolve(item);
      };
      
      request.onerror = (event) => {
        console.error(`Erreur lors de la création dans ${this.storeName}:`, event);
        reject(`Erreur lors de la création: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  async update(id: string, item: T): Promise<T> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(this.serialize(item));
      
      request.onsuccess = () => {
        resolve(item);
      };
      
      request.onerror = (event) => {
        reject(`Erreur lors de la mise à jour: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        reject(`Erreur lors de la suppression: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  async findById(id: string): Promise<T | null> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(this.deserialize(request.result));
        } else {
          resolve(null);
        }
      };
      
      request.onerror = (event) => {
        reject(`Erreur lors de la recherche: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  async findAll(): Promise<T[]> {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result.map(item => this.deserialize(item)));
      };
      
      request.onerror = (event) => {
        reject(`Erreur lors de la récupération: ${(event.target as IDBRequest).error}`);
      };
    });
  }

  protected abstract serialize(item: T): any;
  protected abstract deserialize(data: any): T;
}