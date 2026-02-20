/**
 * EventTriggerNodes.js
 * 
 * Physical volumes (boxes, spheres) in the game world that trigger logic when entered.
 * Perfect for cinematic moments, changing game state, or spawning encounters.
 */

export class EventTriggerNodes {
    constructor() {
        this.triggers = new Map();
    }

    /**
     * @param {string} id - Unique trigger ID
     * @param {Object} bounds - Bounding volume data (e.g. { type: 'sphere', position: {x,y,z}, radius: 10 })
     * @param {Function} callback - What happens when triggered
     * @param {boolean} triggerOnce - If it should be removed after firing
     */
    addTrigger(id, bounds, callback, triggerOnce = true) {
        this.triggers.set(id, {
            bounds: bounds,
            callback: callback,
            triggerOnce: triggerOnce,
            isActive: true
        });
    }

    checkCollisions(entityPos) {
        for (const [id, trigger] of this.triggers.entries()) {
            if (!trigger.isActive) continue;

            if (this.isInsideBounds(entityPos, trigger.bounds)) {
                this.fireTrigger(id);
            }
        }
    }

    isInsideBounds(pos, bounds) {
        if (bounds.type === 'sphere') {
            const distSq = Math.pow(pos.x - bounds.position.x, 2) +
                Math.pow(pos.y - bounds.position.y, 2) +
                Math.pow(pos.z - bounds.position.z, 2);
            return distSq <= Math.pow(bounds.radius, 2);
        }

        if (bounds.type === 'box') {
            return pos.x >= bounds.min.x && pos.x <= bounds.max.x &&
                pos.y >= bounds.min.y && pos.y <= bounds.max.y &&
                pos.z >= bounds.min.z && pos.z <= bounds.max.z;
        }

        return false;
    }

    fireTrigger(id) {
        const trigger = this.triggers.get(id);
        if (!trigger) return;

        console.log(`[EventTriggerNodes] Firing trigger: ${id}`);
        trigger.callback();

        if (trigger.triggerOnce) {
            trigger.isActive = false;
        }
    }

    removeTrigger(id) {
        this.triggers.delete(id);
    }
}
