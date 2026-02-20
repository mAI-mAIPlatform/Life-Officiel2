import { Events } from '../../utils/Events.js';

/**
 * LIFE RPG - Reputation Manager
 * Suit l'alignement global du joueur face à 3 grands axes :
 * Corps, Gangs, et Police (NCPD). Influeceau prix Market et aux réactions des foules.
 */
class RepManager {
    constructor() {
        // -100 (Hostile) à 100 (Allié)
        this.factions = {
            'police': 0,
            'corpo': 0,
            'gang': 0
        };

        // Street Cred (0 à 50) global level
        this.streetCred = 1;
        this.streetCredXp = 0;
    }

    init() { }

    modifyFactionRep(faction, amount) {
        if (this.factions[faction] !== undefined) {
            this.factions[faction] = Math.max(-100, Math.min(100, this.factions[faction] + amount));
            Events.emit('social:rep_changed', { faction, value: this.factions[faction] });
        }
    }

    addStreetCred(xp) {
        this.streetCredXp += xp;
        if (this.streetCredXp >= this.streetCred * 1000) {
            this.streetCredXp -= this.streetCred * 1000;
            this.streetCred++;

            Events.emit('ui:show_notification', {
                title: "STREET CRED LEVEL UP",
                message: `You reached level ${this.streetCred}`,
                type: "success"
            });
            // Débloque de nouvelles armes / bagnoles
        }
    }

    getReaction(npcType) {
        const rep = this.factions[npcType];
        if (rep < -50) return 'hostile';
        if (rep > 50) return 'friendly';
        return 'neutral';
    }
}

export const ReputationManager = new RepManager();
