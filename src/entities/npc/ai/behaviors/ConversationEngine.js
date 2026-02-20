/**
 * ConversationEngine.js
 * 
 * Procedural dialogue engine. Uses nodes, conditionals, and player stats
 * to generate dynamic conversations rather than static text trees.
 */

export class ConversationEngine {
    constructor() {
        this.activeConversation = null;
    }

    startConversation(playerStats, npcData, dialogueTree) {
        console.log(`[ConversationEngine] Starting dialogue with ${npcData.name}`);
        this.activeConversation = {
            player: playerStats,
            npc: npcData,
            tree: dialogueTree,
            currentNode: dialogueTree.rootNode
        };
        return this.renderCurrentNode();
    }

    renderCurrentNode() {
        const node = this.activeConversation.tree.nodes[this.activeConversation.currentNode];

        // Filter available responses based on player's stats (Charisma, Street Cred)
        const validResponses = node.responses.filter(resp => {
            if (resp.condition) {
                return this.evaluateCondition(resp.condition);
            }
            return true;
        });

        return {
            npcText: node.text,
            options: validResponses
        };
    }

    evaluateCondition(condition) {
        const stats = this.activeConversation.player;
        if (condition.type === 'stat_check') {
            return stats[condition.stat] >= condition.value;
        } else if (condition.type === 'item_check') {
            // Check inventory
            return true; // placeholder
        }
        return true;
    }

    selectResponse(responseIndex, validResponses) {
        const selected = validResponses[responseIndex];

        // Execute side effects (e.g., gain item, change attitude)
        if (selected.action) {
            selected.action(this.activeConversation);
        }

        // Move to next node or end
        if (selected.nextNode === 'END') {
            this.endConversation();
            return null;
        } else {
            this.activeConversation.currentNode = selected.nextNode;
            return this.renderCurrentNode();
        }
    }

    endConversation() {
        console.log(`[ConversationEngine] Dialogue ended.`);
        this.activeConversation = null;
    }
}
