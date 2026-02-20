/**
 * StrangerLogic.js
 * 
 * Logic and AI wrapper for ephemeral NPC quest-givers.
 * Spawns an NPC that calls out to the player or offers a quick task.
 */

export class StrangerLogic {
    constructor(entityId, npcData) {
        this.entityId = entityId;
        this.npcData = npcData;

        this.state = 'waiting'; // waiting, interacting, busy, fleeing
        this.playerRef = null;

        this.interactionRadius = 5.0; // Distance to trigger interaction UI
        this.questGenerated = null;
    }

    init(playerRef) {
        this.playerRef = playerRef;
        this.generateQuest();
    }

    generateQuest() {
        const questTemplates = [
            { type: 'delivery', target: 'Neon District', reward: 500 },
            { type: 'intimidation', target: 'Local Thug', reward: 1000 },
            { type: 'retrieval', target: 'Lost USB', reward: 800 }
        ];
        this.questGenerated = questTemplates[Math.floor(Math.random() * questTemplates.length)];
    }

    update() {
        if (!this.playerRef) return;

        const dist = this.calculateDistanceToPlayer();

        if (this.state === 'waiting' && dist < this.interactionRadius) {
            this.offerQuest();
        }
    }

    calculateDistanceToPlayer() {
        // Assume simple distance check
        const p1 = this.npcData.position;
        const p2 = this.playerRef.position;
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.z - p2.z, 2));
    }

    offerQuest() {
        this.state = 'interacting';

        // Trigger UI event (e.g. ConversationEngine or mOS alert)
        // dispatchEvent(new CustomEvent('StrangerInteraction', { detail: { id: this.entityId, quest: this.questGenerated }}));
        console.log(`[StrangerLogic] Offering quest: ${this.questGenerated.type} for ${this.questGenerated.reward} mCoins.`);
    }

    completeInteraction(accepted) {
        this.state = 'busy';
        if (accepted) {
            console.log(`[StrangerLogic] Quest accepted. Starting logic.`);
            // Inform mission manager
        } else {
            console.log(`[StrangerLogic] Quest declined. Wandering off.`);
            // Revert to normal wander AI
        }
    }
}
