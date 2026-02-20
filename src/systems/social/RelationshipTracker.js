import { Events } from '../../utils/Events.js';
import DialogueDB from '../../data/dialogue_trees.json' with { type: 'json' };

/**
 * LIFE RPG - Relationship Tracker
 * Suit l'affinité avec des NPCs uniques et "Nommés" (Fixers, Romance, Boss).
 */
class RelationshipSystem {
    constructor() {
        this.relationships = {}; // { 'npc_jackie': 50, 'boss_dex': -10 }
    }

    init() {
        // Init par defaut selon background
    }

    modifyAffinity(npcId, amount) {
        if (!this.relationships[npcId]) {
            this.relationships[npcId] = 0; // Neutre par defaut
        }

        this.relationships[npcId] = Math.max(-100, Math.min(100, this.relationships[npcId] + amount));

        if (amount > 0) {
            Events.emit('ui:show_notification', { title: "RELATIONSHIP", message: `${npcId} liked that.`, type: "success" });
        } else if (amount < 0) {
            Events.emit('ui:show_notification', { title: "RELATIONSHIP", message: `${npcId} will remember that.`, type: "error" });
        }
    }

    getAffinity(npcId) {
        return this.relationships[npcId] || 0;
    }

    /**
     * Joue un noeud de dialogue.
     * Les noeuds dispo varient selon l'affinité.
     */
    getAvailableDialogueOptions(npcId, currentNodeId) {
        const tree = DialogueDB[npcId];
        if (!tree) return [];

        const node = tree[currentNodeId];
        if (!node) return [];

        const affinity = this.getAffinity(npcId);

        // Filtre les options selon conditions d'affinité
        return node.options.filter(opt => {
            if (opt.reqAffinityMin && affinity < opt.reqAffinityMin) return false;
            if (opt.reqAffinityMax && affinity > opt.reqAffinityMax) return false;
            return true;
        });
    }
}

export const RelationshipTracker = new RelationshipSystem();
