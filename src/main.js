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

            // ──── ÉTAPE 1 : Moteur 3D ─────────────────────────────────────
            this._setProgress(15, 'Initialisation du moteur 3D...');
            await this._delay(50); // Laisse le DOM se mettre à jour
            Engine.init('game-canvas-container');
            if (!Engine.isInitialized) {
                throw new Error('Échec critique : moteur WebGL non initialisé.');
            }

            // ──── ÉTAPE 2 : Physique & Inputs ────────────────────────────
            this._setProgress(30, 'Initialisation physique et inputs...');
            await this._delay(30);
            Physics.init();
            Input.init('game-canvas-container');
            TimeManager.init();
            CameraSystem.init();

            // ──── ÉTAPE 3 : Sauvegarde ───────────────────────────────────
            this._setProgress(45, 'Chargement du système de sauvegarde...');
            await this._delay(30);
            try {
                await SaveSystem.init();
            } catch (saveErr) {
                Logger.warn('SaveSystem', 'Système de sauvegarde ignoré (erreur non bloquante):', saveErr);
            }

            // ──── ÉTAPE 4 : UI ───────────────────────────────────────────
            this._setProgress(60, "Initialisation de l'interface...");
            await this._delay(30);
            UIManager.init();

            // ──── ÉTAPE 5 : World & Entités ──────────────────────────────
            this._setProgress(72, 'Génération du monde...');
            await this._delay(30);
            try {
                WorldManager.init();
            } catch (worldErr) {
                Logger.warn('World', 'Erreur non bloquante WorldManager:', worldErr);
            }
            try { CrowdManager.init(); } catch (e) { Logger.warn('Crowd', e); }
            try { TrafficAI.init(); } catch (e) { Logger.warn('Traffic', e); }

            // ──── ÉTAPE 6 : Systèmes de jeu ──────────────────────────────
            this._setProgress(85, 'Initialisation des systèmes...');
            await this._delay(30);
            try { JobManager.init(); } catch (e) { Logger.warn('Jobs', e); }
            try { MarketManager.init(); } catch (e) { Logger.warn('Market', e); }
            try { CryptoSystem.init(); } catch (e) { Logger.warn('Crypto', e); }
            try { Bank.init(); } catch (e) { Logger.warn('Bank', e); }
            try { CombatManager.init(); } catch (e) { Logger.warn('Combat', e); }
            try { HealthSystem.init(); } catch (e) { Logger.warn('Health', e); }

            // ──── ÉTAPE 7 : Events & Game Loop ───────────────────────────
            this._setProgress(95, 'Lancement de la boucle principale...');
            await this._delay(30);
            this._setupGlobalEvents();

            // Enregistre la fonction d'update principale dans la GameLoop
            GameLoop.addUpdate(this.update.bind(this), 100);
            // Enregistre la fonction de rendu
            GameLoop.addRender(this._render.bind(this), 100);
            GameLoop.start();

            // ──── ÉTAPE 8 : Chargement Assets (non-bloquant, en arrière-plan) ─
            if (typeof AssetLoader.init === 'function') {
                try { await AssetLoader.init(); } catch (e) { }
            }

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
            // Affiche l'erreur dans l'UI et masque quand même le boot screen après 5s
            await this._delay(5000);
            this._hideBootScreen();
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
