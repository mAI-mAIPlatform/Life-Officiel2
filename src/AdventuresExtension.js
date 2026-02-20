/**
 * AdventuresExtension.js
 * 
 * Central orchestrator for the Life-Officiel2 Expansion:
 * Adventures, AI, Supercars & Shopping.
 * 
 * Imports all root modules and injects them into the GameEngine loop.
 */

// Phase 1: Adventures
import { AdventurePopcorn } from './systems/adventures/AdventurePopcorn.js';
import { ChaseManager } from './systems/adventures/ChaseManager.js';
import { HiddenLootSystem } from './systems/adventures/HiddenLootSystem.js';
import { EventTriggerNodes } from './systems/adventures/EventTriggerNodes.js';

// Phase 2: AI Behaviors (mAI Assistant example)
import { mAI_Assistant } from './entities/npc/ai/behaviors/mAI_Assistant.js';
import { PanicSystem } from './entities/npc/ai/behaviors/PanicSystem.js';

// Phase 4: mStore Ecosystem
import { mStoreApp } from './ui/mOS/apps/mStore/mStoreApp.js';

export class AdventuresExtension {
    constructor(gameEngine, saveSystem) {
        this.engine = gameEngine;
        this.saveSystem = saveSystem;

        console.log("[AdventuresExtension] Booting NeoCity final fun layer...");

        // Initialize Systems
        this.adventurePopcorn = new AdventurePopcorn(gameEngine.worldManager, gameEngine.playerRef);
        this.chaseManager = new ChaseManager();
        this.lootSystem = new HiddenLootSystem();
        this.triggerNodes = new EventTriggerNodes();

        this.mAI = new mAI_Assistant();
        this.panicSystem = new PanicSystem();

        this.mStore = new mStoreApp(this.saveSystem);
        this.mStore.init('mStore_mount_point'); // Assumes div id="mStore_mount_point" exists in index.html
    }

    update(deltaTime) {
        // Tie into main game loop
        this.adventurePopcorn.update(deltaTime);
        this.chaseManager.updateChases(deltaTime, this.engine.worldManager);
        this.panicSystem.update(deltaTime);

        if (this.engine.playerRef) {
            this.triggerNodes.checkCollisions(this.engine.playerRef.position);
        }
    }
}
