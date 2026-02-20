import { Events } from '../../utils/Events.js';
import ItemsDB from '../../data/items.json' with { type: 'json' };

/**
 * LIFE RPG - Global Economy Market
 * Simule les variations de prix des objets globalement (Inflation/Déflation).
 */
class MarketSimulation {
    constructor() {
        // Multiplicateur global des prix de la ville (1.0 = normal)
        this.globalInflationLevel = 1.0;

        // Multiplicateurs par categorie
        this.categoryMultipliers = {
            'Weapon': 1.0,
            'Consumable': 1.0,
            'Cyberware': 1.0,
            'Junk': 1.0
        };

        // Historique pour graphiques éventuels
        this.history = [];
    }

    init() {
        Events.on('time:hour_passed', () => this._simulateMarketShift());
    }

    _simulateMarketShift() {
        // L'économie fluctue chaque heure in-game

        // Inflation globale glisse doucement (Random walk capé)
        const shift = (Math.random() - 0.5) * 0.05; // +/- 2.5%
        this.globalInflationLevel = Math.max(0.5, Math.min(2.0, this.globalInflationLevel + shift));

        // Variations spécifiques par catégories (Ex: Les armes montent si le Crime rate monte)
        // Ici, pur random walk
        for (const cat in this.categoryMultipliers) {
            const catShift = (Math.random() - 0.5) * 0.1;
            this.categoryMultipliers[cat] = Math.max(0.2, Math.min(5.0, this.categoryMultipliers[cat] + catShift));
        }

        // Sauvegarder dans historique
        this.history.push({
            time: Date.now(),
            global: this.globalInflationLevel,
            weapons: this.categoryMultipliers['Weapon']
        });

        if (this.history.length > 24) this.history.shift(); // Garde 24h d'historique

        Events.emit('economy:market_updated');
    }

    /**
     * Retourne le prix d'achat ACHUTEL (inflacionné) d'un objet
     */
    getBuyPrice(itemId) {
        const item = ItemsDB.find(i => i.id === itemId);
        if (!item) return 0;

        const catMult = this.categoryMultipliers[item.category] || 1.0;
        const finalPrice = item.baseValue * this.globalInflationLevel * catMult;

        return Math.floor(finalPrice);
    }

    /**
     * Retourne le prix de vente (Souvent 30% du prix d'achat)
     */
    getSellPrice(itemId) {
        return Math.floor(this.getBuyPrice(itemId) * 0.3);
    }
}

export const MarketManager = new MarketSimulation();
