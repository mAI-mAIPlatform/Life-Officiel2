import { Events } from '../../utils/Events.js';
import { Player } from '../../entities/player/Player.js';

/**
 * LIFE RPG - Health & Status System (Avancé)
 * Gère les statuts altérés (Saignement, Empoisonnement, Brûlure)
 * au delà du simple "HPpool" qui est dans PlayerStats.
 */
class StatusEffectManager {
    constructor() {
        this.activeEffects = []; // { type: 'bleed', duration: 5.0, tickRate: 1.0, damagePerTick: 2, timer: 0 }
    }

    init() { }

    update(dt) {
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeEffects[i];

            effect.duration -= dt;
            effect.timer += dt;

            // Appliquer le dot (Damage over Time)
            if (effect.timer >= effect.tickRate) {
                effect.timer = 0;

                // Si l'effet affecte le Joueur
                if (effect.targetId === 'player') {
                    Player.stats.applyDamage(effect.damagePerTick);
                    Events.emit('ui:show_notification', { title: "STATUS", message: `Taking ${effect.type} damage!`, type: "error" });
                } else {
                    // Affecte un PNJ
                    Events.emit('combat:hit_npc', { id: effect.targetId, damage: effect.damagePerTick });
                }
            }

            // Fin de l'effet
            if (effect.duration <= 0) {
                this.activeEffects.splice(i, 1);
            }
        }
    }

    applyEffect(targetId, type, duration, dpt) {
        // Anti-doublon stacking simplifé : On reset le timer si l'effet existe déjà
        const existing = this.activeEffects.find(e => e.targetId === targetId && e.type === type);
        if (existing) {
            existing.duration = Math.max(existing.duration, duration); // Garde la durée la plus longue
        } else {
            this.activeEffects.push({
                targetId: targetId,
                type: type,
                duration: duration,
                tickRate: 1.0, // Chaque sec
                damagePerTick: dpt,
                timer: 0
            });
            if (targetId === 'player') {
                // UI Icon pour "Bleeding" ou "Burning"
                Events.emit(`status:applied_${type}`);
            }
        }
    }
}

export const HealthSystem = new StatusEffectManager();
