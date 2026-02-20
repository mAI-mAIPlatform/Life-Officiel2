/**
 * AdventurePopcorn.js
 * 
 * Central spawner for random events in NeoCity.
 * "Popcorns" dynamic encounters like accidents, deals, or aggressions around the player.
 */

export class AdventurePopcorn {
    constructor(worldManger, playerRef) {
        this.worldManager = worldManger;
        this.playerRef = playerRef;
        
        this.activeEvents = new Map();
        this.spawnTimer = 0;
        this.spawnInterval = 30000; // Attempt spawn every 30s
        
        this.eventTypes = ['accident', 'deal', 'aggression', 'street_race'];
    }

    update(deltaTime) {
        this.spawnTimer += deltaTime;
        
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.attemptSpawnEvent();
        }
        
        this.cleanupFinishedEvents();
    }

    attemptSpawnEvent() {
        if (this.activeEvents.size >= 5) return; // Max 5 active random events
        
        // 30% chance to actually spawn an event when attempted
        if (Math.random() > 0.3) return;

        const playerPos = this.playerRef.position;
        if (!playerPos) return;

        // Spawn radius between 50 and 150 units away
        const spawnRadius = 50 + Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;
        
        const spawnPos = {
            x: playerPos.x + Math.cos(angle) * spawnRadius,
            y: playerPos.y,
            z: playerPos.z + Math.sin(angle) * spawnRadius
        };

        const eventType = this.eventTypes[Math.floor(Math.random() * this.eventTypes.length)];
        this.createEvent(eventType, spawnPos);
    }

    createEvent(type, position) {
        const eventId = `event_${Date.now()}`;
        console.log(`[AdventurePopcorn] Spawning ${type} at`, position);
        
        const newEvent = {
            id: eventId,
            type: type,
            position: position,
            status: 'active',
            createdAt: Date.now()
        };
        
        this.activeEvents.set(eventId, newEvent);
        // Delegate to specific event factories or WorldManager to spawn necessary entities/props
    }

    cleanupFinishedEvents() {
        // Logic to remove events if the player moves too far or if they resolve
        for (const [id, event] of this.activeEvents.entries()) {
            if (Date.now() - event.createdAt > 120000) { // 2 minute lifetime by default
                this.activeEvents.delete(id);
                console.log(`[AdventurePopcorn] Event ${id} expired.`);
            }
        }
    }
}
