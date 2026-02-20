import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { GameLoop } from './core/GameLoop.js';
import { Time as TimeManager } from './core/TimeManager.js';
import { Physics } from './core/Physics.js';
import { Input } from './core/InputHandler.js';
import { AssetLoader } from './core/AssetLoader.js';
import { CameraSystem } from './core/CameraManager.js';
import { SaveSystem } from './core/SaveSystem.js';

import { UIManager } from './ui/UIManager.js';
import { Events } from './utils/Events.js';
import { Logger } from './utils/Logger.js';

// Managers & Entities
import { WorldManager } from './world/WorldManager.js';
import { Player } from './entities/player/Player.js';
import { CrowdManager } from './entities/npc/CrowdManager.js';
import { TrafficAI } from './entities/npc/TrafficAI.js';
import { JobManager } from './systems/careers/JobManager.js';
import { MarketManager } from './systems/economy/Market.js';
import { CryptoSystem } from './systems/economy/CryptoSystem.js';
import { Bank } from './systems/economy/Bank.js';
import { CombatManager } from './systems/combat/CombatManager.js';
import { HealthSystem } from './systems/combat/HealthSystem.js';

/**
 * LIFE RPG - MAIN ENTRY POINT
 * Initialise l'architecture et démarre la boucle principale.
 */
class GameCore {
    constructor() {
        this.isReady = false;
        this._bootProgressFill = null;
        this._bootStatusText = null;
    }

    async boot() {
        Logger.info('LIFE', 'Démarrage de LIFE RPG...');

        // Récupère les éléments de loading
        this._bootProgressFill = document.getElementById('boot-progress-fill');
        this._bootStatusText = document.getElementById('boot-status-text');

        try {

            // ──── ÉTAPE 1 : Chargement des Assets ────────────────────────
            this._setProgress(5, 'Chargement des assets...');
            if (typeof AssetLoader.init === 'function') await AssetLoader.init();
            try {
                await AssetLoader.preloadRegistryAssets();
            } catch (e) {
                Logger.warn('AssetLoader', 'Erreurs de préchargement (placeholders GLTF ignorés).');
            }

            // ──── ÉTAPE 2 : Moteur 3D ─────────────────────────────────────
            this._setProgress(20, 'Initialisation du moteur 3D...');
            Engine.init('game-canvas-container');
            if (!Engine.isInitialized) {
                throw new Error('Échec critique : moteur WebGL non initialisé.');
            }

            // ──── ÉTAPE 3 : Physique & Inputs ────────────────────────────
            this._setProgress(35, 'Initialisation physique et inputs...');
            Physics.init();
            Input.init('game-canvas-container');
            TimeManager.init();
            CameraSystem.init(Engine.camera);

            // ──── ÉTAPE 4 : Sauvegarde ───────────────────────────────────
            this._setProgress(50, 'Chargement du système de sauvegarde...');
            await SaveSystem.init();

            // ──── ÉTAPE 5 : UI ───────────────────────────────────────────
            this._setProgress(60, 'Initialisation de l\'interface...');
            UIManager.init();

            // ──── ÉTAPE 6 : World & Entités ──────────────────────────────
            this._setProgress(70, 'Génération du monde...');
            WorldManager.init();
            CrowdManager.init();
            TrafficAI.init();

            // ──── ÉTAPE 7 : Systèmes de jeu ──────────────────────────────
            this._setProgress(85, 'Initialisation des systèmes...');
            JobManager.init();
            MarketManager.init();
            CryptoSystem.init();
            Bank.init();
            CombatManager.init();
            HealthSystem.init();

            // ──── ÉTAPE 8 : Events & Game Loop ───────────────────────────
            this._setProgress(95, 'Lancement de la boucle principale...');
            this._setupGlobalEvents();

            // Enregistre la fonction d'update principale dans la GameLoop
            GameLoop.addUpdate(this.update.bind(this), 100);
            // Enregistre la fonction de rendu
            GameLoop.addRender(this._render.bind(this), 100);
            GameLoop.start();

            this.isReady = true;
            this._setProgress(100, 'Prêt !');
            Logger.info('LIFE', 'Moteur LIFE RPG prêt.');

            // ──── ÉTAPE 9 : Masquer le boot screen ───────────────────────
            await this._delay(400);
            this._hideBootScreen();

            // ──── ÉTAPE 10 : Démarrer le jeu ─────────────────────────────
            await this._delay(900); // Attendre fin animation fade-out
            this.startGameplay();

        } catch (error) {
            Logger.fatal('LIFE', 'Erreur critique lors du boot', error);
            this._setProgress(0, `❌ Erreur : ${error.message}`);
        }
    }

    /**
     * Démarre le gameplay après le boot
     */
    startGameplay() {
        // Spawn du joueur avec THREE importé correctement
        Player.init(new THREE.Vector3(0, 5, 0));
        Player.setIdentity('V', 'streetkid', 2500);

        // Affiche le HUD
        Events.emit('ui:show_hud');
    }

    /**
     * Mise à jour de la logique (appelée par GameLoop.addUpdate — fixed step)
     * @param {number} dt DeltaTime fixe (1/60s par défaut)
     */
    update(dt) {
        if (!this.isReady) return;

        // 1. Input poll (souris, clavier, gamepad)
        Input.update();

        // 2. Player
        Player.update(dt);

        // 3. Physique
        Physics.update(dt);

        // 4. Monde & Entités
        const pPos = Player.controller ? Player.controller.getPosition() : null;
        if (pPos) {
            WorldManager.update(dt, pPos);
            CrowdManager.update(dt, pPos);
            TrafficAI.update(dt, pPos);
        }

        // 5. Combat & Santé
        CombatManager.update(dt);
        HealthSystem.update(dt);
    }

    /**
     * Rendu 3D (appelée par GameLoop.addRender — variable step)
     * @param {number} dt DeltaTime de la frame
     * @param {number} alpha Facteur d'interpolation (0 à 1)
     */
    _render(dt, alpha) {
        if (!this.isReady) return;
        Engine.render();
    }

    /**
     * Mise à jour de la barre de progression du boot
     */
    _setProgress(percent, message) {
        if (this._bootProgressFill) {
            this._bootProgressFill.style.width = `${percent}%`;
        }
        if (this._bootStatusText) {
            this._bootStatusText.textContent = message;
        }
        Logger.info('Boot', `[${percent}%] ${message}`);
    }

    /**
     * Cache l'écran de boot avec animation
     */
    _hideBootScreen() {
        const bootScreen = document.getElementById('boot-screen');
        if (bootScreen) {
            bootScreen.classList.add('fade-out');
            setTimeout(() => {
                bootScreen.style.display = 'none';
            }, 900);
        }
    }

    /**
     * Helper : promesse de délai
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Écoute des événements globaux de système
     */
    _setupGlobalEvents() {
        // Resize de fenêtre
        window.addEventListener('resize', () => {
            Engine.resize();
        });

        // Écoute progression d'assets pour update la barre
        Events.on('assets:progress', ({ progress }) => {
            this._setProgress(Math.round(5 + progress * 15), 'Chargement des assets...');
        });

        // Écoute event pour afficher le HUD
        Events.on('ui:show_hud', () => {
            const hud = document.getElementById('hud-container');
            if (hud) hud.classList.remove('hidden');
        });

        Events.on('ui:hide_hud', () => {
            const hud = document.getElementById('hud-container');
            if (hud) hud.classList.add('hidden');
        });

        // Pause / Reprise
        Events.on('gameloop:pause', () => {
            GameLoop.stop();
        });
        Events.on('gameloop:resume', () => {
            GameLoop.start();
        });

        // Debug : F1 toggle physique, F2 toggle FPS
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                // TODO: toggle le debugger physique
            }
        });

        // Visibilité de la page (pour éviter la spirale de la mort)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                Logger.info('LIFE', 'Page masquée — Pause de la boucle');
                // GameLoop arrête automatiquement grâce au clamping de delta
            } else {
                Logger.info('LIFE', 'Page visible — Reprise');
            }
        });
    }
}

// Lancement au chargement du module
const Game = new GameCore();
Game.boot();

// Exposer pour le debugging en console navigateur (dev uniquement)
if (import.meta.env.DEV) {
    window.__LIFE__ = Game;
    window.__THREE__ = THREE;
}
