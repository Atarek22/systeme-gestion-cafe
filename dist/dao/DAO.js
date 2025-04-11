"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexedDBDAO = void 0;
require("fake-indexeddb/auto");
// Classe abstraite pour gérer la connexion à IndexedDB
class IndexedDBDAO {
    constructor(storeName, keyPath) {
        this.dbName = "CafeManagementDB";
        this.dbVersion = 1;
        this.storeName = storeName;
        this.keyPath = keyPath;
        // Enregistrer ce magasin pour la création ultérieure
        const existingStore = IndexedDBDAO.allStores.find(s => s.storeName === storeName);
        if (!existingStore) {
            IndexedDBDAO.allStores.push({ storeName, keyPath });
        }
    }
    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                // Créer tous les magasins d'objets enregistrés
                IndexedDBDAO.allStores.forEach(store => {
                    if (!db.objectStoreNames.contains(store.storeName)) {
                        console.log(`Création du magasin d'objets: ${store.storeName}`);
                        db.createObjectStore(store.storeName, { keyPath: store.keyPath });
                    }
                });
            };
            request.onsuccess = (event) => {
                const db = event.target.result;
                // Vérification supplémentaire: si le magasin n'existe pas, recréer la base de données
                if (!db.objectStoreNames.contains(this.storeName)) {
                    console.log(`Le magasin ${this.storeName} n'existe pas. Mise à niveau de la base de données...`);
                    db.close();
                    // Augmenter la version pour forcer une mise à niveau
                    const newVersion = this.dbVersion + 1;
                    console.log(`Tentative d'ouverture avec la version ${newVersion}`);
                    const newRequest = indexedDB.open(this.dbName, newVersion);
                    newRequest.onupgradeneeded = (upgradeEvent) => {
                        const newDb = upgradeEvent.target.result;
                        if (!newDb.objectStoreNames.contains(this.storeName)) {
                            console.log(`Création du magasin manquant: ${this.storeName}`);
                            newDb.createObjectStore(this.storeName, { keyPath: this.keyPath });
                        }
                    };
                    newRequest.onsuccess = (successEvent) => {
                        resolve(successEvent.target.result);
                    };
                    newRequest.onerror = (errorEvent) => {
                        reject(`Erreur lors de la mise à niveau: ${errorEvent.target.error}`);
                    };
                }
                else {
                    resolve(db);
                }
            };
            request.onerror = (event) => {
                reject(`Erreur d'ouverture de la base de données: ${event.target.error}`);
            };
        });
    }
    async create(item) {
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
                reject(`Erreur lors de la création: ${event.target.error}`);
            };
        });
    }
    async update(id, item) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.put(this.serialize(item));
            request.onsuccess = () => {
                resolve(item);
            };
            request.onerror = (event) => {
                reject(`Erreur lors de la mise à jour: ${event.target.error}`);
            };
        });
    }
    async delete(id) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);
            request.onsuccess = () => {
                resolve(true);
            };
            request.onerror = (event) => {
                reject(`Erreur lors de la suppression: ${event.target.error}`);
            };
        });
    }
    async findById(id) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);
            request.onsuccess = () => {
                if (request.result) {
                    resolve(this.deserialize(request.result));
                }
                else {
                    resolve(null);
                }
            };
            request.onerror = (event) => {
                reject(`Erreur lors de la recherche: ${event.target.error}`);
            };
        });
    }
    async findAll() {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            request.onsuccess = () => {
                resolve(request.result.map(item => this.deserialize(item)));
            };
            request.onerror = (event) => {
                reject(`Erreur lors de la récupération: ${event.target.error}`);
            };
        });
    }
}
exports.IndexedDBDAO = IndexedDBDAO;
// Registre statique de tous les magasins d'objets
IndexedDBDAO.allStores = [];
