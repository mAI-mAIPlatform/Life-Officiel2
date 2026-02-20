import * as THREE from 'three';
import { VehiclePhysics } from './VehiclePhysics.js';
import { Engine } from '../../core/Engine.js';
import { Input } from '../../core/InputHandler.js';
import { CameraSystem } from '../../core/CameraManager.js';

export class Car {
    constructor(startPosition = new THREE.Vector3(0, 2, 0)) {
        this.id = 'car_' + Math.random().toString(36).substr(2, 9);

        // Physique
        this.physics = new VehiclePhysics(1500, { w: 2, h: 0.8, d: 4.5 }, startPosition);

        // Tuning
        this.maxEngineForce = 3000;
        this.maxSteeringVal = 0.5; // Radians (~30 deg)
        this.brakeForce = 100000;

        this.isPlayerDriving = false;

        this._buildVisuals();
        this._setupWheels();
    }

    _buildVisuals() {
        this.meshGroup = new THREE.Group();

        // Chassis Mesh (Placeholder Mclaren-like low-poly)
        const bodyGeo = new THREE.BoxGeometry(2, 0.8, 4.5);
        bodyGeo.translate(0, 0.4, 0); // Repere en bas
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff0033, roughness: 0.2, metalness: 0.8 }); // Red metallic
        this.chassisMesh = new THREE.Mesh(bodyGeo, bodyMat);
        this.chassisMesh.castShadow = true;
        this.meshGroup.add(this.chassisMesh);

        /* // TODO: Verres, Phares, Pot d'échappement etc. */

        Engine.scene.add(this.meshGroup);
    }

    _setupWheels() {
        const w = 1.0;  // Offset X
        const h = 0.0;  // Offset Y (Auteur de la suspension relative au centre chassis)
        const d = 1.4;  // Offset Z

        // 0: Gauche Avant, 1: Droite Avant, 2: Gauche Arriere, 3: Droite Arriere
        this.physics.addWheel(-w, h, d, true);   // Avant Gauche
        this.physics.addWheel(w, h, d, true);   // Avant Droite
        this.physics.addWheel(-w, h, -d, false, { frictionSlip: 4 }); // Arriere Gauche (Moin de grip pour drifter ;) )
        this.physics.addWheel(w, h, -d, false, { frictionSlip: 4 }); // Arriere Droite

        // Visual Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        wheelGeo.rotateZ(Math.PI / 2); // Coucher le cylindre
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });

        for (let i = 0; i < 4; i++) {
            const wMesh = new THREE.Mesh(wheelGeo, wheelMat);
            wMesh.castShadow = true;
            Engine.scene.add(wMesh);
            this.physics.wheelMeshes.push(wMesh);
        }
    }

    enterVehicle() {
        this.isPlayerDriving = true;
        CameraSystem.setTarget(this.meshGroup);
        // Important: Décaler la position cible de la caméra derrière la voiture
        CameraSystem.mode = 'TPS';
    }

    exitVehicle() {
        this.isPlayerDriving = false;
        // Remet inputs a 0
        this.physics.setSteeringValue(0, 0);
        this.physics.setSteeringValue(0, 1);
        this.physics.applyEngineForce(0, 2);
        this.physics.applyEngineForce(0, 3);
        this.physics.setBrake(this.brakeForce, 0);
        this.physics.setBrake(this.brakeForce, 1);
        this.physics.setBrake(this.brakeForce, 2);
        this.physics.setBrake(this.brakeForce, 3);
    }

    update(dt) {
        // 1. Sync Visuel / Physique Chassis
        const pos = this.physics.chassisBody.position;
        const quat = this.physics.chassisBody.quaternion;

        this.meshGroup.position.copy(pos);
        this.meshGroup.quaternion.copy(quat);

        // 2. Sync des roues individuelles
        this.physics.update();

        // 3. Inputs si conduis
        if (this.isPlayerDriving) {
            this._handleInputs();
        }
    }

    _handleInputs() {
        // Input.actions.moveY va de -1 à 1

        let engineForce = 0;
        let brakingForce = 0;

        if (Input.actions.moveY > 0) {
            // Avancer (RWD - Propulsion arrière)
            engineForce = this.maxEngineForce;
            // Libère les freins
            this.physics.setBrake(0, 0);
            this.physics.setBrake(0, 1);
            this.physics.setBrake(0, 2);
            this.physics.setBrake(0, 3);
        } else if (Input.actions.moveY < 0) {
            // Frein / Recul
            // Si on avance (vitesse > x), on freine. Sinon on recule.
            const velZ = this.physics.chassisBody.velocity.length();
            // C'est un peu naif, normalement il faut verifier la composante locale Z de la vélocité
            if (velZ > 2) {
                brakingForce = this.brakeForce;
            } else {
                engineForce = -this.maxEngineForce * 0.5; // Recule moins vite
                this.physics.setBrake(0, 0);
                this.physics.setBrake(0, 1);
                this.physics.setBrake(0, 2);
                this.physics.setBrake(0, 3);
            }
        } else {
            // Engine Brake leger si pas d'input
            this.physics.setBrake(100, 2);
            this.physics.setBrake(100, 3);
            this.physics.setBrake(0, 0);
            this.physics.setBrake(0, 1);
        }

        // Spacebar Handbrake
        if (Input.actions.jump) {
            brakingForce = this.brakeForce; // Freins arrières bloque direct
            this.physics.setBrake(brakingForce * 1.5, 2);
            this.physics.setBrake(brakingForce * 1.5, 3);
            this.physics.setBrake(0, 0);
            this.physics.setBrake(0, 1); // Laisse l'avant libre pour drifter
        } else if (brakingForce > 0) {
            // Freinage standard (Disques partout proportionnellement)
            this.physics.setBrake(brakingForce * 0.7, 0);
            this.physics.setBrake(brakingForce * 0.7, 1);
            this.physics.setBrake(brakingForce * 0.3, 2);
            this.physics.setBrake(brakingForce * 0.3, 3);
        }

        // Appliquer aux roues arrières
        this.physics.applyEngineForce(engineForce, 2);
        this.physics.applyEngineForce(engineForce, 3);

        // Direction purement basée sur input X horizontal (Clavier ou Stick gauche)
        const steering = -Input.actions.moveX * this.maxSteeringVal;

        // Appliquer aux roues avants
        this.physics.setSteeringValue(steering, 0);
        this.physics.setSteeringValue(steering, 1);
    }
}
