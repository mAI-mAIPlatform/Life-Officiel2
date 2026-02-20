/**
 * ChaseManager.js
 * 
 * Dynamic pursuit system (Player vs Authorities, Gangs vs Player, etc.).
 * Coordinates multiple NPC vehicles or foot units to intercept a target.
 */

export class ChaseManager {
    constructor() {
        this.activeChases = new Map();
        this.maxUnitsPerChase = 5;
    }

    initChase(targetId, chaseType = 'police', intensityLevel = 1) {
        const chaseId = `chase_${targetId}_${Date.now()}`;

        this.activeChases.set(chaseId, {
            target: targetId,
            type: chaseType,
            intensity: intensityLevel,
            units: [], // List of NPC entity IDs participating
            status: 'hunting'
        });

        console.log(`[ChaseManager] Started ${chaseType} chase against ${targetId} at intensity ${intensityLevel}`);
        this.spawnChaseUnits(chaseId);
        return chaseId;
    }

    spawnChaseUnits(chaseId) {
        const chase = this.activeChases.get(chaseId);
        if (!chase) return;

        const numUnits = Math.min(chase.intensity * 2, this.maxUnitsPerChase);
        for (let i = 0; i < numUnits; i++) {
            // Spawn unit logic here, offset behind or around the target
            // e.g. WorldManager.spawnVehicle('police_cruiser', behindTargetPos);
            chase.units.push(`unit_${chaseId}_${i}`);
        }
    }

    updateChases(deltaTime, worldData) {
        for (const [id, chase] of this.activeChases.entries()) {
            if (chase.status === 'evaded' || chase.status === 'busted') {
                this.endChase(id);
                continue;
            }

            this.updateUnitTactics(chase, worldData);
        }
    }

    updateUnitTactics(chase, worldData) {
        // Here we'd map over chase.units and assign them interception points
        // using steering behaviors: pursue, arrive, seek, or block road.

        // Example logic:
        // if target distance > 500m -> chance to lose them
        // if target speed == 0 and units distance < 5m -> BUSTED
    }

    endChase(chaseId) {
        const chase = this.activeChases.get(chaseId);
        if (chase) {
            console.log(`[ChaseManager] Chase ended: ${chaseId}. Target ${chase.status}.`);
            this.activeChases.delete(chaseId);

            // Dispatch cleanup event for units
        }
    }
}
