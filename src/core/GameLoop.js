import { EngineConfig } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';
import { Events } from '../utils/Events.js';

/**
 * LIFE RPG - Game Loop Manager
 * Implémente une boucle de jeu avancée avec découplage du temps :
 * - Tick pour la logique/physique (Fixed Time Step)
 * - Tick pour le rendu (Variable Time Step - Interpolé)
 * Cette architecture empêche la physique de bugger lors de chutes de framerate.
 */
class GameLoopManager {
    constructor() {
        this.isRunning = false;
        this.lastTime = 0;
        this.accumulator = 0;

        // Le pas de temps fixe défini par la configuration (1/60 par défaut)
        this.fixedDelta = EngineConfig.LOOP.PHYSICS_TICK_RATE;
        this.maxSubSteps = EngineConfig.LOOP.MAX_SUB_STEPS; // Sécurité spirale de la mort

        // Stockage des Callbacks
        // On sépare Render et Update
        this.updateListeners = [];
        this.renderListeners = [];

        // L'ID du raf pour pouvoir l'annuler
        this.animationFrameId = null;

        // Liaison de portée pour le requestAnimationFrame
        this._loop = this._loop.bind(this);
    }

    /**
     * Démarre la boucle principale
     */
    start() {
        if (this.isRunning) return;

        Logger.info('Engine', 'Démarrage de la Game Loop Utama...');
        this.isRunning = true;
        this.lastTime = performance.now() / 1000;
        this.accumulator = 0;

        // Lancement !
        this.animationFrameId = requestAnimationFrame(this._loop);
        Events.emit('gameloop:started');
    }

    /**
     * Stoppe la boucle (Pause, Menus, ou Crash)
     */
    stop() {
        if (!this.isRunning) return;

        Logger.info('Engine', 'Arrêt de la Game Loop Utama.');
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        Events.emit('gameloop:stopped');
    }

    /**
     * Ajoute un système qui doit être mis à jour de manière FIXE (ex: IA, Physique)
     * @param {Function} callback (fixedDelta) => void
     * @param {number} priority Ordre d'exécution, le plus bas en premier.
     */
    addUpdate(callback, priority = 10) {
        this._addSorted(this.updateListeners, callback, priority);
    }

    /**
     * Ajoute un système qui doit être mis à jour à chaque affichage d'image (ex: Rendu 3D, UI interpolée)
     * @param {Function} callback (deltaTime, alphaInterpolation) => void
     * @param {number} priority Ordre d'exécution
     */
    addRender(callback, priority = 10) {
        this._addSorted(this.renderListeners, callback, priority);
    }

    /**
     * Retire un callback d'update
     * @param {Function} callback
     */
    removeUpdate(callback) {
        this.updateListeners = this.updateListeners.filter(item => item.cb !== callback);
    }

    /**
     * Retire un callback de render
     * @param {Function} callback 
     */
    removeRender(callback) {
        this.renderListeners = this.renderListeners.filter(item => item.cb !== callback);
    }

    /**
     * Interne: ajoute en respectant l'ordre de priorité
     */
    _addSorted(array, callback, priority) {
        // Eviter les doubles ajouts
        const exists = array.find(item => item.cb === callback);
        if (exists) return;

        array.push({ cb: callback, priority });
        // Tri croissant de priorité (0 s'exécute AVANT 10)
        array.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Le coeur de l'engin : Fixed Time Step Implementation
     * @param {number} timeTimestamp 
     */
    _loop(timeTimestamp) {
        if (!this.isRunning) return;

        // Relance la boucle pour le prochain frame navigateur
        this.animationFrameId = requestAnimationFrame(this._loop);

        const currentTime = timeTimestamp / 1000;
        let deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Prévention "Spiral of death" : si le joueur minimise la fenêtre, deltaTime devient énorme
        // La physique tenterait de rattraper 3 jours de framerate et crasherait.
        // On borne le deltaTime à l'équivalent de nos sous-étapes max
        const maxDelta = this.fixedDelta * this.maxSubSteps;
        if (deltaTime > maxDelta) {
            Logger.warn('Engine', `Chute de framerate détectée/Fenêtre minimisée (Delta = ${deltaTime.toFixed(3)}s) - Clamping appliqué.`);
            deltaTime = maxDelta;
        }

        // Modulation globale du temps (Slow motion, pause)
        deltaTime *= EngineConfig.LOOP.TIME_SCALE;

        // Accumulation du temps pour les ticks fixes
        this.accumulator += deltaTime;

        // 1. UPDATE TICK FIXE (Physique, Logique Serveur, IA)
        // Tant que nous "devons" du temps au moteur, on met à jour la logique.
        while (this.accumulator >= this.fixedDelta) {
            this._runUpdates(this.fixedDelta);
            this.accumulator -= this.fixedDelta;
        }

        // 2. RENDER TICK (Graphismes, Interpolation)
        // alpha représente le "reste" de temps non simulé entre deux ticks fixes (0.0 à 1.0)
        // Utilisé pour interpoler graphiquement les meshes entre la frame passée et actuelle
        const alpha = this.accumulator / this.fixedDelta;

        // Traitement des event async sur un budget frame temps avant le render !
        Events.processAsync();

        this._runRenders(deltaTime, alpha);
    }

    /**
     * Exécute les cycles logiques
     */
    _runUpdates(dt) {
        for (let i = 0; i < this.updateListeners.length; i++) {
            try {
                this.updateListeners[i].cb(dt);
            } catch (error) {
                Logger.error('Engine', `Update GameLoop Error`, error);
            }
        }
    }

    /**
     * Exécute les cycles de dessins
     */
    _runRenders(dt, alpha) {
        for (let i = 0; i < this.renderListeners.length; i++) {
            try {
                this.renderListeners[i].cb(dt, alpha);
            } catch (error) {
                Logger.error('Engine', `Render GameLoop Error`, error);
            }
        }
    }
}

// Export en singleton
export const GameLoop = new GameLoopManager();
