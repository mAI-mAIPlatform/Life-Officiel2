import { Events } from '../../utils/Events.js';
import { PlayerConfig } from '../../utils/Constants.js';

export class PlayerStats {
    constructor() {
        this.maxHealth = PlayerConfig.RPG.MAX_HEALTH;
        this.health = this.maxHealth;
        this.healthRegenTime = 0;

        this.maxStamina = 100;
        this.stamina = this.maxStamina;

        // Attributs RPG de base (0 à 20)
        this.attributes = {
            strength: 5,
            agility: 5,
            intelligence: 5,
            charisma: 5
        };

        this.level = 1;
        this.xp = 0;
    }

    init() {
        // Envoie les valeurs initiales au HUD
        this._notifyHealth();
        this._notifyStamina();
    }

    update(dt) {
        // Regen de Stamina passive
        if (this.stamina < this.maxStamina) {
            // TODO: Checker isSprinting via module PlayerController pour empêcher la regen
            this.stamina += 5 * dt; // Regen de 5/sec
            if (this.stamina > this.maxStamina) this.stamina = this.maxStamina;
            this._notifyStamina();
        }

        // Regen de vie après x secondes hors combat (Regen auto)
        if (this.health < this.maxHealth && this.healthRegenTime > 5.0) { // 5s idle
            this.health += 2 * dt;
            if (this.health > this.maxHealth) this.health = this.maxHealth;
            this._notifyHealth();
        } else {
            this.healthRegenTime += dt;
        }
    }

    applyDamage(amount) {
        if (amount <= 0 || this.health <= 0) return;

        this.health -= amount;
        this.healthRegenTime = 0; // Reset regen timer

        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }

        this._notifyHealth();
        Events.emit('player:damaged', amount);
    }

    heal(amount) {
        if (amount <= 0 || this.health >= this.maxHealth) return;
        this.health = Math.min(this.health + amount, this.maxHealth);
        this._notifyHealth();
    }

    consumeStamina(amount) {
        if (this.stamina >= amount) {
            this.stamina -= amount;
            this._notifyStamina();
            return true; // Action autorisée
        }
        return false; // Pas assez de stamina
    }

    die() {
        Events.emit('player:died');
        console.log("MORT DU JOUEUR (Wasted)");
        // Lancement Overlay Wasted, reset save...
    }

    _notifyHealth() {
        Events.emit('player:health_changed', { current: this.health, max: this.maxHealth });
    }

    _notifyStamina() {
        Events.emit('player:stamina_changed', { current: this.stamina, max: this.maxStamina });
    }

    serialize() {
        return {
            health: this.health,
            stamina: this.stamina,
            attributes: this.attributes,
            level: this.level,
            xp: this.xp
        };
    }

    deserialize(data) {
        if (!data) return;
        this.health = data.health || this.maxHealth;
        this.stamina = data.stamina || this.maxStamina;
        this.attributes = data.attributes || this.attributes;
        this.level = data.level || 1;
        this.xp = data.xp || 0;

        this._notifyHealth();
        this._notifyStamina();
    }
}
