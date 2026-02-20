import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';
import { Engine } from '../../core/Engine.js';
import { Car } from '../vehicles/Car.js';

/**
 * LIFE RPG - Traffic AI
 * Contrôle les véhicules autonomes circulant dans la ville.
 */
class TrafficSystem {
    constructor() {
        this.activeVehicles = [];
        this.maxTraffic = 20;
        this.spawnRadius = 150;
        this.despawnRadius = 250;
    }

    init() { }

    update(dt, playerPosition) {
        for (let i = this.activeVehicles.length - 1; i >= 0; i--) {
            const aiCar = this.activeVehicles[i];

            this._simulateDriving(aiCar, dt);

            // Sync Visuel Graphique (La logique de Car.js le fait deja, on call sa methode update mais en disant qu'on n'est pas le joueur)
            aiCar.carEntity.update(dt);

            // Culling
            const distSq = this._distSq(playerPosition, aiCar.carEntity.physics.chassisBody.position);
            if (distSq > this.despawnRadius * this.despawnRadius) {
                this._despawnCar(i);
            }
        }

        if (Math.random() > 0.95 && this.activeVehicles.length < this.maxTraffic) {
            this._spawnRandomCar(playerPosition);
        }
    }

    _simulateDriving(aiCar, dt) {
        // Logique "Tron" basique : Avance tout droit à Vitesse Constante
        // Pas de raycast complet ici pour eviter la surcharge CPU.
        // Utilise le cannonJS Engine Force
        const targetSpeed = 15; // m/s
        const currentSpeed = aiCar.carEntity.physics.chassisBody.velocity.length();

        if (currentSpeed < targetSpeed) {
            aiCar.carEntity.physics.applyEngineForce(1500, 2); // Rear wheels
            aiCar.carEntity.physics.applyEngineForce(1500, 3);
            aiCar.carEntity.physics.setBrake(0, 0);
            aiCar.carEntity.physics.setBrake(0, 1);
        } else {
            // Coupe les gaz ou freine si trop vite
            aiCar.carEntity.physics.applyEngineForce(0, 2);
            aiCar.carEntity.physics.applyEngineForce(0, 3);
        }

        // TODO: NavMesh ou Waypoints pour tourner
        aiCar.carEntity.physics.setSteeringValue(0, 0);
        aiCar.carEntity.physics.setSteeringValue(0, 1);
    }

    _spawnRandomCar(playerPosition) {
        const angle = Math.random() * Math.PI * 2;
        const spawnX = playerPosition.x + Math.cos(angle) * this.spawnRadius;
        const spawnZ = playerPosition.z + Math.sin(angle) * this.spawnRadius;

        const carEntity = new Car(new THREE.Vector3(spawnX, 2, spawnZ));

        // Orienter la voiture de base (Random)
        const q = new Physics.cannon.Quaternion();
        q.setFromAxisAngle(new Physics.cannon.Vec3(0, 1, 0), Math.random() * Math.PI * 2);
        carEntity.physics.chassisBody.quaternion.copy(q);

        this.activeVehicles.push({
            id: `traffic_${Date.now()}`,
            carEntity: carEntity
        });
    }

    _despawnCar(index) {
        const aiCar = this.activeVehicles[index];
        const car = aiCar.carEntity;

        // Remove from ThreeJS
        Engine.scene.remove(car.meshGroup);
        car.physics.wheelMeshes.forEach(w => Engine.scene.remove(w));

        // Remove from CannonJS
        Physics.world.removeBody(car.physics.chassisBody);
        car.physics.wheelBodies.forEach(wb => Physics.world.removeBody(wb));
        car.physics.vehicle.removeFromWorld(Physics.world);

        this.activeVehicles.splice(index, 1);
    }

    _distSq(vA, vB) {
        const dx = vA.x - vB.x;
        const dy = vA.y - vB.y;
        const dz = vA.z - vB.z;
        return (dx * dx) + (dy * dy) + (dz * dz);
    }
}

export const TrafficAI = new TrafficSystem();
