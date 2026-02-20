/**
 * ShopkeeperAI.js
 * 
 * Logic for merchants and shopkeepers in NeoCity.
 * Uses "Zone Memory" to remember the player's reputation and past crimes.
 */

export class ShopkeeperAI {
    constructor(npcEntity, shopData) {
        this.npc = npcEntity;
        this.shopData = shopData;

        this.state = 'idle'; // idle, interacting, panicked, hostile
        this.attitude = 50;  // 0-100, determines prices

        // Zone memory references player's local reputation
        this.memoryKey = `shopkeeper_${shopData.shopId}`;
    }

    init(saveSystem) {
        this.saveSystem = saveSystem;
        this.loadMemory();
    }

    loadMemory() {
        // e.g., if player robbed this place yesterday
        const memory = this.saveSystem.getGlobalState(this.memoryKey) || { robberies: 0, totalSpent: 0 };

        if (memory.robberies > 0) {
            this.attitude = 10; // Hates player
        } else if (memory.totalSpent > 10000) {
            this.attitude = 90; // Loves VIP player
        }
    }

    update(playerRef) {
        // Distances check to trigger greeting
        const threshold = 10;
        const dist = this.npc.distanceTo(playerRef.position);

        if (this.state === 'idle' && dist < threshold) {
            this.greetPlayer();
        }
    }

    greetPlayer() {
        if (this.attitude < 20) {
            console.log(`[Shopkeeper]: "I'm watching you. No funny business."`);
        } else if (this.attitude > 80) {
            console.log(`[Shopkeeper]: "Welcome back, VIP! We have new stock for you!"`);
        } else {
            console.log(`[Shopkeeper]: "Welcome to ${this.shopData.name}. Let me know if you need help."`);
        }
        this.state = 'interacting';
    }

    handleTheftAttempt() {
        this.state = 'panicked';
        this.attitude = 0;

        // Save memory
        let memory = this.saveSystem.getGlobalState(this.memoryKey) || { robberies: 0, totalSpent: 0 };
        memory.robberies += 1;
        this.saveSystem.setGlobalState(this.memoryKey, memory);

        // Call cops
        console.log(`[Shopkeeper]: "Security! Police! We're being robbed!"`);
        // e.g. ChaseManager.initChase(playerId, 'police');
    }

    getPricesModifier() {
        // High attitude = discount. Low attitude = markup
        if (this.attitude > 80) return 0.8; // 20% discount
        if (this.attitude < 20) return 1.5; // 50% markup
        return 1.0;
    }
}
