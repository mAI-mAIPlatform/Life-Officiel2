import { Events } from '../../../utils/Events.js';
import { JobManager } from '../JobManager.js';
import { Player } from '../../../entities/player/Player.js';

export class Hacker {
    constructor() {
        this.title = "NetRunner / Hacker";
        this.reputation = 0; // Se monte via les Gigs
    }

    // Contrairement à un job régulier, on active un "Mini-Jeu" ou une action longue
    startHack(targetDifficulty) {
        Events.emit('ui:show_notification', { title: "NETRUN", message: "Breaching Ice...", type: "info" });

        // Simule 3 secondes de processing
        setTimeout(() => {
            const successChance = 0.5 + (this.reputation * 0.05) - (targetDifficulty * 0.1);
            if (Math.random() < successChance) {
                const stolenDataValue = Math.floor(Math.random() * 5000 * targetDifficulty);
                Player.addMoney(stolenDataValue);
                this.reputation++;
                Events.emit('ui:show_notification', { title: "BREACH SUCCESS", message: `Data mined: €$${stolenDataValue}`, type: "success" });
            } else {
                Events.emit('ui:show_notification', { title: "BREACH FAILED", message: "ICE Detected. Neural Feedback received.", type: "error" });
                Player.stats.applyDamage(20 * targetDifficulty);
                // Augmente le wanted level si foiré
                Events.emit('player:crime_committed', 1);
            }
        }, 3000);
    }
}

export class Thief {
    constructor() {
        this.title = "Burglar / Carjacker";
        this.stealthSkill = 1;
    }

    pickpocket(targetNPC) {
        const difficulty = targetNPC.type === 'corpo' ? 0.3 : 0.8; // Les corpos sont plus safe
        const successChance = this.stealthSkill * 0.1 * difficulty;

        if (Math.random() < successChance) {
            const loot = Math.floor(Math.random() * 500);
            Player.addMoney(loot);
            this.stealthSkill += 0.1;
            Events.emit('ui:show_notification', { title: "STEALTH", message: `Pickpocketed €$${loot}`, type: "success" });
        } else {
            Events.emit('ui:show_notification', { title: "STEALTH FAILED", message: "Target noticed you!", type: "error" });
            if (targetNPC.brain) targetNPC.brain.setState('FLEE'); // ou Combat
            Events.emit('player:crime_committed', 1);
        }
    }
}
