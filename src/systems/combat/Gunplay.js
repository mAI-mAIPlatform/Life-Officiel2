import * as THREE from 'three';
import { Events } from '../../utils/Events.js';
import { Input } from '../../core/InputHandler.js';
import { CameraSystem } from '../../core/CameraManager.js';
import { PlayerConfig } from '../../utils/Constants.js';

/**
 * LIFE RPG - Gunplay System
 * Gère le tir des armes à feu, le recul (recoil), le spread (dispersion),
 * et la cadence de tir (fire rate).
 */
export class GunplaySystem {
    constructor() {
        this.equippedWeaponInfo = null;

        // Cooldowns
        this.nextFireTime = 0;
        this.isAiming = false;

        // Recoil tracking
        this.currentRecoil = 0;
        this.recoilRecoveryRate = 5;
    }

    init() {
        Events.on('inventory:weapon_equiped', (weapon) => {
            this.equippedWeaponInfo = weapon;
            // weapon (id, dmg, firerate, spread, recoil)
        });
    }

    update(dt) {
        if (!this.equippedWeaponInfo) return;

        if (this.nextFireTime > 0) this.nextFireTime -= dt;

        // Recoil Recovery
        if (this.currentRecoil > 0) {
            this.currentRecoil = Math.max(0, this.currentRecoil - (this.recoilRecoveryRate * dt));
            // Fait redescendre lentement la caméra
            CameraSystem.camera.rotation.x += (this.currentRecoil * 0.05 * dt);
        }

        // Aiming (Iron Sights) -> Click droit
        // TODO: Hook to Input.actions.aim (Si ajouté dans InputHandler)
        const isAimingInput = false; // Mock
        if (isAimingInput && !this.isAiming) {
            this.isAiming = true;
            // Reduire FOV via CameraManager
        } else if (!isAimingInput && this.isAiming) {
            this.isAiming = false;
            // Restaurer FOV
        }

        // Firing -> Click gauche
        // Input.actions.fire -> Pas implémenté on mock via un bouton souris 0 (Si ajouté Input.actions.mouseLeft)
        const isFiring = false; // Mock
        if (isFiring && this.nextFireTime <= 0) {
            this._fireWeapon();
        }
    }

    _fireWeapon() {
        const wp = this.equippedWeaponInfo;

        // TODO: Checker ammo dans chargeur (Consommer 1)

        this.nextFireTime = 1.0 / wp.fireRate; // ex: 10 cps = 0.1s d'attente

        // 1. Calculer Dispersion (Spread)
        const spreadMultiplier = this.isAiming ? 0.2 : 1.0;
        const totalSpread = wp.baseSpread * spreadMultiplier + (this.currentRecoil * 0.1);

        const rx = (Math.random() - 0.5) * totalSpread;
        const ry = (Math.random() - 0.5) * totalSpread;

        const dir = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(rx, ry, 0)).applyQuaternion(CameraSystem.camera.quaternion);

        // 2. Raycast
        const hitSomething = false; // Physics.raycast(CameraSystem.camera.position, dir, 500)

        if (hitSomething) {
            const targetId = 'npc_456';
            const isCrit = Math.random() < 0.1; // 10% chance headshot

            Events.emit('combat:fire', {
                sourceId: 'player',
                targetId: targetId,
                damage: wp.damage,
                hitPosition: new THREE.Vector3(),
                isCritical: isCrit
            });
        }

        // 3. Appliquer Recul Camera (Kick vertical)
        this.currentRecoil += wp.recoilKick;
        CameraSystem.camera.rotation.x -= (wp.recoilKick * 0.02); // Monte la camera brutalement
        Events.emit('camera:shake', { intensity: wp.recoilKick * 0.5, duration: 0.1 });

        // 4. Muzzle Flash & Audio
        Events.emit('audio:play_sfx', { name: wp.fireSound });
        // TODO: Particules devant le fusil
    }
}
