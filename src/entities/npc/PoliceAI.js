import * as THREE from 'three';
import { NPCBase } from './NPCBase.js';
import { Car } from '../vehicles/Car.js';
import { Events } from '../../utils/Events.js';

export class PoliceAI {
    constructor() {
        this.activeUnits = [];
        this.wantedLevel = 0; // 0 à 5 étoiles
        this.playerTarget = null; // Position estimée du joueur
    }

    init() {
        Events.on('player:crime_committed', (severity) => this._increaseWantedLevel(severity));
        // Idéalement, playerEntity déclenche ça quand il tire sur qqn ou vole une voiture
    }

    update(dt, playerPosition) {
        if (this.wantedLevel === 0) return;

        this.playerTarget = playerPosition; // Triche: La police sait toujours où est le joueur pour l'instant

        // Gérer les unités actives
        for (let i = this.activeUnits.length - 1; i >= 0; i--) {
            const unit = this.activeUnits[i];

            if (unit.type === 'car') {
                this._updatePoliceCar(unit, dt);
            } else {
                this._updatePoliceOfficer(unit, dt);
            }
        }

        // Renforts
        const maxUnits = this.wantedLevel * 2; // lvl 1 = 2 unités, lvl 5 = 10 unités
        if (this.activeUnits.length < maxUnits && Math.random() > 0.98) {
            this._spawnUnit(playerPosition);
        }
    }

    _increaseWantedLevel(amount) {
        if (this.wantedLevel < 5) {
            this.wantedLevel = Math.min(5, this.wantedLevel + amount);
            Events.emit('ui:show_notification', {
                title: 'NCPD ALERT',
                message: `Wanted Level: ${this.wantedLevel}`,
                type: 'error'
            });
        }
    }

    _spawnUnit(targetPos) {
        // Spawn un peu en dehors de la vue
        const angle = Math.random() * Math.PI * 2;
        const dist = 100;
        const spawnPos = new THREE.Vector3(
            targetPos.x + Math.cos(angle) * dist,
            targetPos.y,
            targetPos.z + Math.sin(angle) * dist
        );

        if (Math.random() > 0.5 || this.wantedLevel > 2) {
            // Spawn Voiture de flic
            const car = new Car(spawnPos);
            // TODO: Changer la couleur du material en Bleu/Rouge + Gyrophares
            this.activeUnits.push({ type: 'car', entity: car });
        } else {
            // Spawn Flics à pied
            const cop = new NPCBase('cop_' + Date.now(), 'police', spawnPos);
            cop.brain.setState('COMBAT'); // Hostile direct
            this.activeUnits.push({ type: 'foot', entity: cop });
        }
    }

    _updatePoliceCar(unit, dt) {
        const car = unit.entity;

        // Target le joueur
        const dx = this.playerTarget.x - car.physics.chassisBody.position.x;
        const dz = this.playerTarget.z - car.physics.chassisBody.position.z;

        // Simplification extrême de l'IA de conduite : Fonce vers le joueur
        const distSq = dx * dx + dz * dz;

        if (distSq > 400) { // Si > 20m, accélère
            car.physics.applyEngineForce(2500, 2);
            car.physics.applyEngineForce(2500, 3);
            car.physics.setBrake(0, 0);
            car.physics.setBrake(0, 1);
        } else {
            // Arrivé, freine
            car.physics.applyEngineForce(0, 2);
            car.physics.applyEngineForce(0, 3);
            car.physics.setBrake(100000, 0);
            car.physics.setBrake(100000, 1);

            // TODO: Les flics sortent de la voiture
        }

        // Direction vers le joueur (Yaw) - Approximatif
        const targetAngle = Math.atan2(dx, dz);
        // On devrait convertir en angle local steering, ici on va omettre ce gros calcul trigo pour rester simple
        // Et juste tourner "vers" l'angle cible
    }

    _updatePoliceOfficer(unit, dt) {
        const cop = unit.entity;

        // Cours vers le joueur
        const dx = this.playerTarget.x - cop.body.position.x;
        const dz = this.playerTarget.z - cop.body.position.z;
        const distSq = dx * dx + dz * dz;

        if (distSq > 100) {
            const dist = Math.sqrt(distSq);
            cop.body.velocity.x = (dx / dist) * cop.brain.runSpeed;
            cop.body.velocity.z = (dz / dist) * cop.brain.runSpeed;
        } else {
            cop.body.velocity.x *= 0.5;
            cop.body.velocity.z *= 0.5;
            // Dans le vrai jeu, tirerait à vue ici
            // Events.emit('combat:fire', { source: cop.id, target: 'player' })
        }
    }
}

export const PoliceSystem = new PoliceAI();
