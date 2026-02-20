/**
 * PanicSystem.js
 * 
 * Boids-like system for crowds. When a danger event triggers (gunshot, explosion),
 * nearby civilians enter panic mode and scatter to find cover or flee the zone.
 */

export class PanicSystem {
    constructor() {
        this.panickedNPCs = new Set();
        this.safeZones = []; // e.g., subway stairs, alleys
    }

    registerSafeZones(zones) {
        this.safeZones = zones;
    }

    triggerPanicEvent(position, radius, severity) {
        console.log(`[PanicSystem] Triggered at ${position.x},${position.z} with radius ${radius}`);
        // Notify WorldManager to get all NPCs within radius
        const npcsInRadius = window.GameEngine.worldManager.getNPCsWithinRadius(position, radius);

        npcsInRadius.forEach(npc => {
            if (npc.type === 'civilian') {
                this.infectNPC(npc.id, position);
            }
        });
    }

    infectNPC(npcId, dangerOrigin) {
        this.panickedNPCs.add(npcId);

        // Override NPC's current behavior tree with 'Flee' node
        const npcObj = window.GameEngine.worldManager.getEntity(npcId);
        if (npcObj && npcObj.behaviorSystem) {
            npcObj.behaviorSystem.setState('flee', { threatOrigin: dangerOrigin });
        }
    }

    update(deltaTime) {
        // Evaluate if NPCs are far enough to calm down
        for (const npcId of this.panickedNPCs) {
            const npcObj = window.GameEngine.worldManager.getEntity(npcId);
            if (!npcObj) {
                this.panickedNPCs.delete(npcId);
                continue;
            }

            // Check if they reached a safe zone or distance
            if (npcObj.behaviorSystem.stateData.safe) {
                npcObj.behaviorSystem.setState('wander');
                this.panickedNPCs.delete(npcId);
            }
        }
    }
}
