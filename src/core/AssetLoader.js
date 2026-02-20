import * as THREE from 'three';
// On utilise le loader GLTF officiel mais il faut l'importer de jsm car il n'est pas dans le form 'three' de base
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Logger } from '../utils/Logger.js';
import { Events } from '../utils/Events.js';

import { ModelsRegistry } from '../data/assets/models_registry.js';
import { TexturesRegistry } from '../data/assets/textures_registry.js';
import { AudioRegistry } from '../data/assets/audio_registry.js';

/**
 * LIFE RPG - Asset Loader Asynchrone
 * Gère le chargement, la mise en cache, et l'instanciation des modèles (GLTF/GLB),
 * Textures et Fichiers Audio. Émet des événements de progression pour les écrans de chargement.
 */
class AssetLoaderSystem {
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.gltfLoader = new GLTFLoader(this.manager);
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.audioLoader = new THREE.AudioLoader(this.manager);
        this.fileLoader = new THREE.FileLoader(this.manager);

        // Configuration pour meshes compressés lourdement (DRACO est le standard web 3D)
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); // Utilisation du CDN officiel pour éviter d'embarquer les binaires WASM dans le repo
        this.gltfLoader.setDRACOLoader(this.dracoLoader);

        /**
         * Les caches stockent la Promise de chargement.
         * Si plusieurs appels demandent le même fichier, ils attendent la même promise.
         */
        this.cache = {
            models: new Map(),
            textures: new Map(),
            audio: new Map(),
            json: new Map()
        };

        this._setupManagerEvents();
    }

    _setupManagerEvents() {
        this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
            Logger.debug('AssetLoader', `Début du chargement: ${url}`);
        };

        this.manager.onLoad = () => {
            Logger.info('AssetLoader', 'Tous les assets de la file d\'attente sont chargés !');
            Events.emit('assets:queue_complete');
        };

        this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = itemsLoaded / itemsTotal;
            // Événement vital pour la barre de chargement UI Liquid Glass
            Events.emit('assets:progress', { url, progress, loaded: itemsLoaded, total: itemsTotal });
        };

        this.manager.onError = (url) => {
            Logger.error('AssetLoader', `Erreur lors du chargement de l'asset: ${url}`);
        };
    }

    /**
     * Charge un Model GLB/GLTF.
     * @param {string} path Chemin vers le modèle
     * @param {boolean} processShadows Active cast/receive shadows sur tous les meshes
     * @returns {Promise<THREE.Group>}
     */
    async loadModel(path, processShadows = true) {
        if (this.cache.models.has(path)) {
            const gltf = await this.cache.models.get(path);
            // On retourne un CLONE du modèle, sinon deux NPC partageraient le m^eme mesh physique!
            return this._cloneGLTF(gltf, processShadows);
        }

        const promise = new Promise((resolve, reject) => {
            this.gltfLoader.load(
                path,
                (gltf) => {
                    resolve(gltf);
                },
                undefined, // OnTrack progress géré par le Manager Global
                (error) => {
                    reject(error);
                }
            );
        });

        this.cache.models.set(path, promise);

        try {
            const result = await promise;
            return this._cloneGLTF(result, processShadows);
        } catch (e) {
            this.cache.models.delete(path); // Error? Retire du cache.
            throw e;
        }
    }

    /**
     * SkinnedMeshes (Armatures/Animations) nécessitent une technique de clonage particulière
     * fournie par des utilitaires squelettiques, sinon les animations cassent.
     */
    _cloneGLTF(gltf, processShadows) {
        // Dans une V1 on clone brutalement.
        // ! Attention ! Pour les Skeletal Animations, SkeletonUtils.clone() de Three.js JSM est requis.
        // Par simplicité, ici on clone purement le scene graph.
        const clone = gltf.scene.clone();

        // Attacher les animations au clone
        clone.animations = gltf.animations;

        if (processShadows) {
            clone.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    // Fix glitchs d'ombres propres
                    child.receiveShadow = true;

                    // Optimisation: Empêcher le renderer de frustum cull si l'objet est géré par nous
                    // child.frustumCulled = true; 
                }
            });
        }

        return clone;
    }

    /**
     * Charge une texture simple
     */
    async loadTexture(path, isColorMap = true) {
        if (this.cache.textures.has(path)) {
            return this.cache.textures.get(path);
        }

        const promise = new Promise((resolve, reject) => {
            this.textureLoader.load(
                path,
                (texture) => {
                    // Les maps de couleurs (albedo/diffuse) doivent être encodées en SRGBColorSpace en Three.js récent
                    if (isColorMap) {
                        texture.colorSpace = THREE.SRGBColorSpace;
                    }
                    // Wrapping repeat par défaut (souvent utile)
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    resolve(texture);
                },
                undefined,
                (error) => reject(error)
            );
        });

        this.cache.textures.set(path, promise);
        return promise;
    }

    /**
     * Charge un fichier Audio
     */
    async loadAudio(path) {
        if (this.cache.audio.has(path)) {
            return this.cache.audio.get(path);
        }

        const promise = new Promise((resolve, reject) => {
            this.audioLoader.load(
                path,
                (buffer) => resolve(buffer),
                undefined,
                (error) => reject(error)
            );
        });

        this.cache.audio.set(path, promise);
        return promise;
    }

    /**
     * Charge un lot d'assets depuis les registres de manière unifiée
     * Utilise Promise.allSettled pour ne pas bloquer si un dummies/placeholder pose problème
     */
    async preloadRegistryAssets(categories = ['models', 'textures', 'audio']) {
        const promises = [];

        if (categories.includes('models')) {
            Object.values(ModelsRegistry).forEach(cat => {
                cat.forEach(item => promises.push(this.loadModel(item.path, item.processShadows)));
            });
        }

        if (categories.includes('textures')) {
            Object.values(TexturesRegistry).forEach(cat => {
                cat.forEach(item => promises.push(this.loadTexture(item.path, item.isColorMap)));
            });
        }

        if (categories.includes('audio')) {
            Object.values(AudioRegistry).forEach(cat => {
                cat.forEach(item => promises.push(this.loadAudio(item.path)));
            });
        }

        await Promise.allSettled(promises);
        Logger.info('AssetLoader', `Préchargement depuis les registres terminé (${promises.length} items vérifiés).`);
    }

    /**
     * Charge un fichier JSON statique de data (ceux de src/data)
     */
    async loadJSON(path) {
        if (this.cache.json.has(path)) {
            return this.cache.json.get(path);
        }

        const promise = new Promise((resolve, reject) => {
            this.fileLoader.setResponseType('json');
            this.fileLoader.load(
                path,
                (data) => resolve(data),
                undefined,
                (err) => reject(err)
            );
        });

        this.cache.json.set(path, promise);
        return promise;
    }

    /**
     * Vider la mémoire (quand on change de zone gigantesque)
     */
    clearCache() {
        Logger.warn('AssetLoader', 'Purge complète du cache d\'assets.');
        this.cache.models.clear();
        this.cache.textures.clear();
        this.cache.audio.clear();
        this.cache.json.clear();
    }
}

export const AssetLoader = new AssetLoaderSystem();
