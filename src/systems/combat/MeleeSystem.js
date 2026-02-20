import * as THREE from 'three';
import { Events } from '../../utils/Events.js';
import { Player } from '../../entities/player/Player.js';
import { Input } from '../../core/InputHandler.js';
import { CameraSystem } from '../../core/CameraManager.js';

export class MeleeSystem {
    constructor() {
        this.isAttacking = false;
        this.attackCooldown = 0;

        this.baseDamage = 15;
        this.reach = 2.0; // Metres
    }

    init() { }

    update(dt) {
        if (this.attackCooldown > 0) {
            this.attackCooldown -= dt;
        }

        // Clic Gauche quand pas d'arme à feu équipée
        // On mock : Touche 'F' (Melee attack habituelle dans certains jeux)
        if (Input.actions.melee && this.attackCooldown <= 0) {
            this._performAttack();
        }
    }

    _performAttack() {
        this.isAttacking = true;
        this.attackCooldown = 0.8; // Attaque par seconde

        // Consomme Stamina
        if (!Player.stats.consumeStamina(10)) {
            // Pas assez d'energie, coup foiré ou très lent
            Events.emit('ui:show_notification', { title: "EXHAUSTED", message: "Not enough stamina to swing!", type: "error" });
            return;
        }

        // Animation de la camera (Petit coup en avant/bas)
        Events.emit('camera:shake', { intensity: 1.5, duration: 0.2 });

        // Hit Detection (Raycast très court)
        // Part du centre de la camera en ligne droite
        const origin = new THREE.Vector3().copy(CameraSystem.camera.position);
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(CameraSystem.camera.quaternion);

        // TODO: Physics.raycast(origin, direction, this.reach)
        // En l'absence de collider retourné par la physique pour l'instant on mock
        const hitSomething = false; // Mettre a true qd raycast OK

        if (hitSomething) {
            const targetId = 'npc_123'; // Mock
            Events.emit('combat:melee', {
                sourceId: 'player',
                targetId: targetId,
                damage: this.baseDamage,
                hitPosition: new THREE.Vector3()
            });
            // Bruit sourd d'impact
            Events.emit('audio:play_sfx', { name: 'punch_hit' });
        } else {
            // Bruit dans le vide (Swoosh)
            Events.emit('audio:play_sfx', { name: 'punch_miss' });
        }
    }
}
