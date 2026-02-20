import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

/**
 * LIFE RPG - Vehicle Physics Base
 * Contient le wrapper pour le Cannon.js RaycastVehicle.
 * Permet d'avoir des physiques de suspension et comportement de pneus réalistes.
 */
export class VehiclePhysics {
    constructor(mass, dimensions = { w: 2, h: 1, d: 4 }, position = new THREE.Vector3(0, 2, 0)) {
        this.chassisBody = null;
        this.vehicle = null;
        this.wheelBodies = [];
        this.wheelMeshes = [];

        this._setupPhysics(mass, dimensions, position);
    }

    _setupPhysics(mass, dim, pos) {
        // --- 1. Chassis Body ---
        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3(dim.w / 2, dim.h / 2, dim.d / 2));
        this.chassisBody = new Physics.cannon.Body({
            mass: mass,
            material: Physics.materials.vehicle
        });
        this.chassisBody.addShape(shape);
        this.chassisBody.position.copy(pos);
        // On abaisse légèrement le centre de masse pour plus de stabilité (Eviter que la voiture se retourne trop vite)
        this.chassisBody.position.y += 0.5;

        // --- 2. RaycastVehicle Setup ---
        this.vehicle = new Physics.cannon.RaycastVehicle({
            chassisBody: this.chassisBody,
            indexRightAxis: 0, // x
            indexUpAxis: 1,    // y
            indexForwardAxis: 2, // z
        });

        // Config Suspension commune par defaut
        this.wheelOptions = {
            radius: 0.4,
            directionLocal: new Physics.cannon.Vec3(0, -1, 0),
            suspensionStiffness: 30,     // Dureté
            suspensionRestLength: 0.4,   // Longueur au repos
            frictionSlip: 5,             // Adhérence (plus grand = accroche plus)
            dampingRelaxation: 2.3,      // Amorti au rebond
            dampingCompression: 4.4,     // Amorti a la compression
            maxSuspensionForce: 100000,
            rollInfluence: 0.1,          // Tendance de la carrosserie a pencher (0.1 = stable)
            axleLocal: new Physics.cannon.Vec3(1, 0, 0),
            chassisConnectionPointLocal: new Physics.cannon.Vec3(1, 1, 0),
            maxSuspensionTravel: 0.3,    // Débattement max
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true
        };

        // Ajout final au World
        this.vehicle.addToWorld(Physics.world);
    }

    /**
     * Ajoute une roue physique au vehicule au point spécifié
     * @param {number} x Offset Largeur
     * @param {number} y Offset Hauteur (Suspension Anchor)
     * @param {number} z Offset Longueur
     * @param {boolean} isFrontWheel Sert a la direction
     */
    addWheel(x, y, z, isFrontWheel, optionsOverride = {}) {
        const options = { ...this.wheelOptions, ...optionsOverride };
        options.chassisConnectionPointLocal.set(x, y, z);

        this.vehicle.addWheel(options);

        // Body cannon optionnel pour interagir physiquement avec la roue (souvent simulé juste par sphere mais bon de l'avoir)
        const wheelBody = new Physics.cannon.Body({ mass: 0, type: Physics.cannon.Body.KINEMATIC });
        wheelBody.collisionFilterGroup = 0; // Les roues gérées par Raycast ne doivent pas collider avec le reste explicitement
        this.wheelBodies.push(wheelBody);
        Physics.world.addBody(wheelBody);
    }

    applyEngineForce(force, wheelIndex) {
        this.vehicle.applyEngineForce(force, wheelIndex);
    }

    setSteeringValue(value, wheelIndex) {
        this.vehicle.setSteeringValue(value, wheelIndex);
    }

    setBrake(force, wheelIndex) {
        this.vehicle.setBrake(force, wheelIndex);
    }

    update() {
        // Synchronise les Mesh des roues factices avec les positions de la physique des suspensions
        for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
            this.vehicle.updateWheelTransform(i);
            const t = this.vehicle.wheelInfos[i].worldTransform;

            // Sync Wheel Body
            this.wheelBodies[i].position.copy(t.position);
            this.wheelBodies[i].quaternion.copy(t.quaternion);

            // Sync Visual Mesh
            if (this.wheelMeshes[i]) {
                this.wheelMeshes[i].position.copy(t.position);
                this.wheelMeshes[i].quaternion.copy(t.quaternion);
            }
        }
    }
}
