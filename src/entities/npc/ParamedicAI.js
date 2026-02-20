import * as THREE from 'three';
import { NPCBase } from './NPCBase.js';
import { Events } from '../../utils/Events.js';
import { Car } from '../vehicles/Car.js';

/**
 * LIFE RPG - Paramedic & Firefighter AI
 * Écoute les events de morts de civils ou d'explosions
 * Arrive en ambulance/camion, réanime ou éteint, puis repart.
 */
class EmergencyServices {
    constructor() {
        this.activeEmergencies = []; // Liste des cibles (corps ou feu)
        this.dispatchedUnits = [];
    }

    init() {
        Events.on('world:pedestrian_died', (pos) => this._dispatchAmbulance(pos));
        Events.on('world:explosion', (pos) => this._dispatchFiretruck(pos));
    }

    update(dt) {
        for (let i = this.dispatchedUnits.length - 1; i >= 0; i--) {
            const unit = this.dispatchedUnits[i];

            // Logique haut niveau
            if (unit.state === 'driving_to_scene') {
                this._driveToScene(unit, dt);
            } else if (unit.state === 'working') {
                this._doWork(unit, dt);
            } else if (unit.state === 'leaving') {
                // S'éloigne
                // (Même logique grossière que driveToScene mais vecteur inversé ou fuite)
                this._driveToScene(unit, dt, true);
                if (unit.workTimer > 20) {
                    this._despawn(i);
                }
            }
        }
    }

    _dispatchAmbulance(targetPos) {
        // Spawn ambulance lejos
        const spawnPos = new THREE.Vector3(targetPos.x + 100, 2, targetPos.z);
        const amb = new Car(spawnPos);
        // amb.mesh.material.color = Blanc / Rouge

        this.dispatchedUnits.push({
            type: 'ambulance',
            vehicle: amb,
            target: targetPos,
            state: 'driving_to_scene',
            workTimer: 0
        });
    }

    _dispatchFiretruck(targetPos) {
        // Idem Firetruck
        const spawnPos = new THREE.Vector3(targetPos.x - 100, 2, targetPos.z);
        const truck = new Car(spawnPos);
        // truck.mesh.material.color = Rouge

        this.dispatchedUnits.push({
            type: 'firetruck',
            vehicle: truck,
            target: targetPos,
            state: 'driving_to_scene',
            workTimer: 0
        });
    }

    _driveToScene(unit, dt, inverse = false) {
        const car = unit.vehicle;
        const dx = unit.target.x - car.physics.chassisBody.position.x;
        const dz = unit.target.z - car.physics.chassisBody.position.z;
        const distSq = dx * dx + dz * dz;

        let force = 2000;
        if (inverse) force = -2000;

        if (distSq > 100 || inverse) {
            car.physics.applyEngineForce(force, 2);
            car.physics.applyEngineForce(force, 3);
            car.physics.setBrake(0, 0);
            car.physics.setBrake(0, 1);
        } else {
            // Arrivé
            car.physics.applyEngineForce(0, 2);
            car.physics.applyEngineForce(0, 3);
            car.physics.setBrake(100000, 0);
            car.physics.setBrake(100000, 1);

            if (!inverse) unit.state = 'working';
        }

        unit.workTimer += dt;
        car.update(dt);
    }

    _doWork(unit, dt) {
        unit.workTimer += dt;
        // Attend 10s sur place (Simule la réanimation / extinction)
        if (unit.workTimer > 10.0) {
            unit.state = 'leaving';
            // Dans le futur, on "delete" le dead body du monde ici
        }
    }

    _despawn(index) {
        const unit = this.dispatchedUnits[index];
        // Remove vehicule
        // Engine.scene.remove(unit.vehicle...);
        this.dispatchedUnits.splice(index, 1);
    }
}

export const EmergencyAI = new EmergencyServices();
