import { Events } from '../../utils/Events.js';

export class PlayerSurvival {
    constructor() {
        // En pourcentages 0-100
        this.hunger = 100;
        this.thirst = 100;
        this.energy = 100; // Sommeil

        // Vitesse de dégradation (%/sec réelle, donc très faible)
        // A calibrer avec le Temps du jeu (TimeManager)
        this.decayRates = {
            hunger: 0.05,
            thirst: 0.1,  // L'eau descend plus vite
            energy: 0.02
        };
    }

    init() { }

    update(dt) {
        // Ces valeurs baissent naturellement
        this.hunger = Math.max(0, this.hunger - (this.decayRates.hunger * dt));
        this.thirst = Math.max(0, this.thirst - (this.decayRates.thirst * dt));
        this.energy = Math.max(0, this.energy - (this.decayRates.energy * dt));

        // Conséquences
        if (this.hunger === 0 || this.thirst === 0) {
            // Emit un damage constant perçu par le PlayerStats s'ils meurent de faim
            Events.emit('player:starving_damage', 1);
        }

        if (this.energy < 20) { // Épuisé (Vision trouble, stamina max limitée)
            Events.emit('player:exhausted');
        }
    }

    eat(value) {
        this.hunger = Math.min(100, this.hunger + value);
        Events.emit('player:survival_updated', this.serialize());
    }

    drink(value) {
        this.thirst = Math.min(100, this.thirst + value);
        Events.emit('player:survival_updated', this.serialize());
    }

    sleep(hours) {
        // 1 heure de sommeil = ~12% d'énergie
        this.energy = Math.min(100, this.energy + (hours * 12));
        Events.emit('player:survival_updated', this.serialize());
    }

    serialize() {
        return {
            hunger: this.hunger,
            thirst: this.thirst,
            energy: this.energy
        };
    }

    deserialize(data) {
        if (!data) return;
        this.hunger = data.hunger;
        this.thirst = data.thirst;
        this.energy = data.energy;
    }
}
