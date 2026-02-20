import { Events } from '../../utils/Events.js';
import { Player } from '../../entities/player/Player.js';
// CrowdManager mock import (si on avait accès a la list des NPCs par ID)

/**
 * LIFE RPG - Combat Manager
 * Arbitre global des dégâts et conflits.
 */
class CombatArbiter {
    constructor() {
        this.inCombat = false;
        this.combatTimer = 0;
    }

    init() {
        Events.on('combat:fire', (data) => this._resolveShot(data));
        Events.on('combat:melee', (data) => this._resolveMelee(data));
        Events.on('combat:explosion', (data) => this._resolveExplosion(data));
    }

    update(dt) {
        if (this.inCombat) {
            this.combatTimer -= dt;
            if (this.combatTimer <= 0) {
                this._exitCombat();
            }
        }
    }

    _enterCombat() {
        if (!this.inCombat) {
            this.inCombat = true;
            Events.emit('world:combat_started');
            // TODO: Stopper musique d'exploration, passer à la musique d'action
        }
        this.combatTimer = 10.0; // 10 secondes sans tirer = fin du combat
    }

    _exitCombat() {
        this.inCombat = false;
        Events.emit('world:combat_ended');
    }

    /**
     * Résout un tir raycast ou projectile
     */
    _resolveShot({ sourceId, targetId, damage, hitPosition, isCritical }) {
        this._enterCombat();
        // Cible le Joueur
        if (targetId === 'player') {
            const finalDamage = isCritical ? damage * 2 : damage;
            Player.stats.applyDamage(finalDamage);
            Events.emit('ui:show_damage_indicator', hitPosition);
        } else {
            // Cible un NPC
            // Idéalement on fait : const npc = CrowdManager.getNpcById(targetId); npc.applyDamage(damage)
            // Mock:
            Events.emit('combat:hit_npc', { id: targetId, damage: damage });
            if (sourceId === 'player') {
                // Son de hitmarker crosshair
                Events.emit('ui:play_hitmarker');
            }
        }
    }

    /**
     * Résout un coup au corps à corps
     */
    _resolveMelee({ sourceId, targetId, damage, hitPosition }) {
        this._enterCombat();
        if (targetId === 'player') {
            Player.stats.applyDamage(damage);
        } else {
            Events.emit('combat:hit_npc', { id: targetId, damage: damage });
        }
    }

    _resolveExplosion({ position, radius, maxDamage }) {
        this._enterCombat();
        // Vérifie la distance du joueur
        const distSq = this._distSq(position, Player.controller.getPosition());
        if (distSq < radius * radius) {
            const dist = Math.sqrt(distSq);
            const falloff = 1 - (dist / radius);
            const dmg = Math.floor(maxDamage * falloff);
            Player.stats.applyDamage(dmg);
            // Effet de caméra shake violent
            Events.emit('camera:shake', { intensity: falloff * 5, duration: 1.0 });
        }

        // Dire à l'emergency AI qu'il y a eu une explosion
        Events.emit('world:explosion', position);
    }

    _distSq(vA, vB) {
        const dx = vA.x - vB.x;
        const dy = vA.y - vB.y;
        const dz = vA.z - vB.z;
        return (dx * dx) + (dy * dy) + (dz * dz);
    }
}

export const CombatManager = new CombatArbiter();
