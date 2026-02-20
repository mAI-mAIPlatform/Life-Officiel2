import { SaveConfig } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';

/**
 * LIFE RPG - IndexedDB Save System
 * Gère la persistance massive des données (Player stat, position, items, economy, zone states).
 * IndexedDB est indispensable comparé au LocalStorage qui limite à ~5MB et bloque le main thread.
 */
class SaveSystemManager {
    constructor() {
        this.db = null;
        this.dbName = SaveConfig.DB_NAME;
        this.dbVersion = SaveConfig.DB_VERSION;
        this.stores = SaveConfig.STORES;
    }

    /**
     * Initialise la connexion IndexedDB
     * @returns {Promise<boolean>}
     */
    init() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                Logger.fatal('SaveSys', 'Votre navigateur ne supporte pas IndexedDB. Sauvegardes impossibles.');
                reject(new Error('IndexedDB not supported'));
                return;
            }

            const request = window.indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                Logger.error('SaveSys', 'Erreur ouverture DB', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                Logger.info('SaveSys', `Connecté à la base locale v${this.dbVersion}`);
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                Logger.info('SaveSys', `Upgrade requis. Création des ObjectStores...`);

                // Créer un store par catégorie (gamestate general, joueur, economie, monde, telephonie)
                this.stores.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' });
                    }
                });
            };
        });
    }

    /**
     * Sauvegarde une donnée dans un store précis
     * @param {string} storeName (ex: 'player')
     * @param {string} id Clé unique (ex: 'slot_1', 'auto_save_current')
     * @param {object} data Objets JSON complexes autorisés grâce à IndexedDB
     * @returns {Promise<void>}
     */
    saveData(storeName, id, data) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error("Base de données non initialisée"));
            }
            if (!this.stores.includes(storeName)) {
                return reject(new Error(`Store invalide: ${storeName}`));
            }

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            // On injecte ou overwrite l'ID dans la payload pour keyPath
            const payload = { ...data, id: id, lastUpdated: Date.now() };

            const request = store.put(payload);

            request.onsuccess = () => resolve();
            request.onerror = (e) => {
                Logger.error('SaveSys', `Erreur sauvegarde [${storeName} : ${id}]`, e.target.error);
                reject(e.target.error);
            };
        });
    }

    /**
     * Charge une donnée depuis un store
     * @returns {Promise<object|null>} Retourne l'objet pur, ou null si non-trouvé
     */
    loadData(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                return reject(new Error("Base de données non initialisée"));
            }

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = (event) => {
                if (event.target.result) {
                    resolve(event.target.result);
                } else {
                    resolve(null); // Pas de sauvegarde trouvée
                }
            };
            request.onerror = (e) => reject(e.target.error);
        });
    }

    /**
     * Pratique: Charge tous les IDs d'un store (par ex: voir toutes les sauvegardes dispos)
     */
    getAllKeys(storeName) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject(new Error("DB non initiale"));

            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAllKeys();

            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    /**
     * Supprime une donnée spécifique
     */
    deleteData(storeName, id) {
        return new Promise((resolve, reject) => {
            if (!this.db) return reject(new Error("DB non initiale"));

            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    }

    /**
     * Atomique: Sauvegarde globale du jeu (tous les stores pour une SLIDE particulière, ex 'slot_1')
     */
    async saveCompoundState(slotId, masterDataObject) {
        Logger.info('SaveSys', `Enregistrement global sur [${slotId}]...`);
        try {
            // masterDataObject devrait ressembler à : { player: {...}, world: {...}, economy: {...} }
            const promises = [];
            for (const [store, data] of Object.entries(masterDataObject)) {
                if (this.stores.includes(store)) {
                    promises.push(this.saveData(store, slotId, data));
                }
            }
            await Promise.all(promises);
            Logger.info('SaveSys', `Jeu sauvé avec succès sur le slot [${slotId}]`);
            return true;
        } catch (e) {
            Logger.error('SaveSys', `Échec critique durant Compound Save`, e);
            return false;
        }
    }

    /**
     * Atomique: Chargement global du jeu (tous les modules pour 'slot_1')
     */
    async loadCompoundState(slotId) {
        Logger.info('SaveSys', `Chargement global depuis [${slotId}]...`);
        try {
            const masterData = {};
            const promises = this.stores.map(async (store) => {
                const data = await this.loadData(store, slotId);
                if (data) masterData[store] = data;
            });
            await Promise.all(promises);

            return masterData;
        } catch (e) {
            Logger.error('SaveSys', `Échec critique durant Compound Load`, e);
            return null;
        }
    }
}

export const SaveSystem = new SaveSystemManager();
