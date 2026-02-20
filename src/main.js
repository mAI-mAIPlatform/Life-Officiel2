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
    }

    async boot() {
        Logger.info("Booting LIFE RPG...");

        // 1. Core Systems Init (Ordre strit)
        if (typeof AssetLoader.init === 'function') await AssetLoader.init();
        try {
            await AssetLoader.preloadRegistryAssets();
        } catch (e) {
            Logger.warn('AssetLoader', 'Erreurs lors du preload. Les Dummies peuvent causer des warnings ThreeJS. Ignorez.');
        }
        Engine.init('game-canvas');
        Physics.init();
        Input.init();
        TimeManager.init();
        CameraSystem.init(Engine.camera);
        await SaveSystem.init();

        // 2. UI & Menus
        UIManager.init();

        // 3. World & Entities
        WorldManager.init();
        CrowdManager.init();
        TrafficAI.init();

        // 4. Systems
        JobManager.init();
        MarketManager.init();
        CryptoSystem.init();
        Bank.init();
        CombatManager.init();
        HealthSystem.init();

        // 5. Hooks
        this._setupGlobalEvents();

        // 6. Start Loop
        GameLoop.start(this.update.bind(this));

        this.isReady = true;
        Logger.info("LIFE RPG Engine Ready.");

        // Montre le menu principal après chargement (Simulé par UIManager ou via dispatch event)
        // Mais pour l'instant direct dans le jeu coté test:
        this.startGameplay();
    }

    startGameplay() {
        // Init Joueur (Mock Spawn)
        Player.init(new window.THREE.Vector3(0, 5, 0));
        Player.setIdentity("V", "streetkid", 500);

        // Affiche HUD
        Events.emit('ui:show_hud');
    }

    update(dt) {
        if (!this.isReady) return;

        // --- TICK ORDER ---

        // 1. Input & Time (Déjà gérés en interne par leurs modules via hooks)

        // 2. Player
        Player.update(dt);

        // 3. Physics Step
        Physics.update(dt);

        // 4. World & Entities
        const pPos = Player.controller.getPosition();
        WorldManager.update(dt, pPos);
        CrowdManager.update(dt, pPos);
        TrafficAI.update(dt, pPos);

        // 5. Combat & Status
        CombatManager.update(dt);
        HealthSystem.update(dt);

        // 6. Render
        Engine.render();
    }

    _setupGlobalEvents() {
        // Resize
        window.addEventListener('resize', () => {
            Engine.resize();
        });

        // Debug Toggles
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                // Toggle physics debug
            }
        });
    }
}

// Lancement au chargement du module
const Game = new GameCore();
Game.boot();
