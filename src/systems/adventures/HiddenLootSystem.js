/**
 * HiddenLootSystem.js
 * 
 * Logic for spawning rare items and hidden stashes inside NeoCity.
 * Uses a spatial grid or preset nodes to distribute loot based on rarity.
 */

export class HiddenLootSystem {
    constructor() {
        this.lootNodes = [];
        this.activeLootBoxes = new Map();

        this.lootTables = {
            'common': [{ id: 'mCoins_small', weight: 60 }, { id: 'snack', weight: 40 }],
            'rare': [{ id: 'gun_mod', weight: 50 }, { id: 'mCoins_large', weight: 50 }],
            'legendary': [{ id: 'supercar_blueprint', weight: 100 }]
        };
    }

    registerLootNodes(nodes) {
        // Nodes derived from level design/data
        this.lootNodes.push(...nodes);
    }

    populateWorld() {
        console.log(`[HiddenLootSystem] Populating hidden loot across ${this.lootNodes.length} nodes...`);
        this.lootNodes.forEach(node => {
            // Only 10% chance for a node to be populated on boot
            if (Math.random() < 0.1) {
                this.spawnLootBox(node);
            }
        });
    }

    spawnLootBox(node) {
        const rarity = this.determineRarity();
        const item = this.rollLoot(rarity);

        const boxId = `loot_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        this.activeLootBoxes.set(boxId, {
            position: node.position,
            item: item,
            rarity: rarity,
            opened: false
        });

        // Signal visual engine to place a glowing stash/box at node.position
    }

    determineRarity() {
        const roll = Math.random();
        if (roll < 0.05) return 'legendary';
        if (roll < 0.3) return 'rare';
        return 'common';
    }

    rollLoot(rarity) {
        const table = this.lootTables[rarity];
        if (!table) return null;

        // Simplistic weighted roll
        let totalWeight = table.reduce((sum, entry) => sum + entry.weight, 0);
        let random = Math.random() * totalWeight;

        for (const entry of table) {
            if (random < entry.weight) return entry.id;
            random -= entry.weight;
        }
        return table[0].id;
    }

    openLoot(boxId, playerInventoryRef) {
        const box = this.activeLootBoxes.get(boxId);
        if (box && !box.opened) {
            box.opened = true;
            console.log(`[HiddenLootSystem] Loot opened! Found a ${box.rarity} item: ${box.item}`);
            // Add to player inventory via save system / mOS

            // Schedule destruction
            setTimeout(() => {
                this.activeLootBoxes.delete(boxId);
            }, 5000);

            return box.item;
        }
        return null;
    }
}
