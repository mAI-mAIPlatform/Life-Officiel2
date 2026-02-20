import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';
import { Engine } from '../../core/Engine.js';
import { Input } from '../../core/InputHandler.js';
import { CameraSystem } from '../../core/CameraManager.js';

/**
 * LIFE RPG - Helicopter Entity
 * Utilise un corps rigide classique mais des forces (Forces Additives)
 * pour simuler le lift, pitch, roll, and yaw au lieu du RaycastVehicle.
 */
export class Helicopter {
    constructor(startPosition = new THREE.Vector3(0, 5, 0)) {
        this.id = 'heli_' + Math.random().toString(36).substr(2, 9);

        this.isPlayerDriving = false;

        // Tuning Hélico
        this.enginePower = 0; // 0 à 1
        this.maxLiftForce = 25000; // Doit vaincre gravity * mass (1000 * 9.81 = ~9810, donc on a de la marge)
        this.pitchRollForce = 4000;
        this.yawForce = 2000;

        this._setupPhysics(startPosition);
        this._buildVisuals();
    }

    _setupPhysics(pos) {
        // Chassis Hélico lourd
        const mass = 1500;
        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3(1.5, 1.5, 3));

        this.body = new Physics.cannon.Body({
            mass: mass,
            linearDamping: 0.5, // Forte résistance à l'air globale pour pas dériver à l'infini
            angularDamping: 0.8 // Stabilisateur gyroscopique de friction
        });

        // Centre de masse un peu bas pour l'effet de pendule 
        this.body.addShape(shape, new Physics.cannon.Vec3(0, 0, 0));
        this.body.position.copy(pos);

        Physics.world.addBody(this.body);
    }

    _buildVisuals() {
        this.meshGroup = new THREE.Group();

        // Cabine
        const bodyGeo = new THREE.BoxGeometry(3, 3, 6);
        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x99aacc, metalness: 0.6, roughness: 0.4 });
        this.chassisMesh = new THREE.Mesh(bodyGeo, bodyMat);
        this.chassisMesh.castShadow = true;
        this.meshGroup.add(this.chassisMesh);

        // Rotor Principal (Pale)
        const rotorGeo = new THREE.BoxGeometry(12, 0.1, 0.5);
        const rotorMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        this.mainRotor = new THREE.Mesh(rotorGeo, rotorMat);
        this.mainRotor.position.set(0, 1.6, 0); // Au dessus
        this.mainRotor.castShadow = true;
        this.meshGroup.add(this.mainRotor);

        // Rotor Queue
        const tailGeo = new THREE.BoxGeometry(0.2, 2, 0.2);
        this.tailRotor = new THREE.Mesh(tailGeo, rotorMat);
        this.tailRotor.position.set(1.6, 0.5, -2.8); // Derriere, sur le coté
        this.meshGroup.add(this.tailRotor);

        Engine.scene.add(this.meshGroup);
    }

    enterVehicle() {
        this.isPlayerDriving = true;
        CameraSystem.setTarget(this.meshGroup);
        CameraSystem.mode = 'TPS';
    }

    exitVehicle() {
        this.isPlayerDriving = false;
        this.enginePower = 0; // Coupe le moteur progressivement
    }

    update(dt) {
        // Snyc Physique vers Graphique
        this.meshGroup.position.copy(this.body.position);
        this.meshGroup.quaternion.copy(this.body.quaternion);

        // Input du pilote
        if (this.isPlayerDriving) {
            this._handleInputs(dt);
        } else {
            // Engine spooldown
            this.enginePower = Math.max(0, this.enginePower - (dt * 0.2));
        }

        // Animer Rotors en fonction de EnginePower
        if (this.enginePower > 0) {
            this.mainRotor.rotation.y += (this.enginePower * 30 * dt);
            this.tailRotor.rotation.x += (this.enginePower * 20 * dt);
        }

        this._applyAeroForces();
    }

    _handleInputs(dt) {
        // Alt (L2/R2 ou Shift/Ctrl)
        const isUp = Input.actions.sprint; // Temporaire : Touche Sprint pour monter
        const isDown = Input.actions.crouch; // Temporaire : Touche Crouch pour descendre

        if (isUp) {
            this.enginePower = Math.min(1.0, this.enginePower + (dt * 0.5));
        } else if (isDown) {
            this.enginePower = Math.max(0.0, this.enginePower - (dt * 0.5));
        } else {
            // Hover logic : Tend vers le Hover Power (~40% pour compenser 1500kg gravité)
            const hoverTarget = (1500 * 9.81) / this.maxLiftForce;
            this.enginePower += (hoverTarget - this.enginePower) * dt;
        }

        // --- Mouvement Horizontal (Pitch & Roll) ---
        // Le pitch (avant/arriere) et roll (gauche/droite) appliquent des couples locaux

        const localRight = new Physics.cannon.Vec3(1, 0, 0);
        const localUp = new Physics.cannon.Vec3(0, 1, 0);
        const localForward = new Physics.cannon.Vec3(0, 0, 1);

        // Convertir en monde
        const worldRight = this.body.quaternion.vmult(localRight);
        const worldUp = this.body.quaternion.vmult(localUp);
        const worldForward = this.body.quaternion.vmult(localForward);

        // MoveY = Avant / Arriere = Pitch = Tourne autour de l'axe X (Right) de l'hélico
        // Note MoveY va de -1 à 1
        if (Math.abs(Input.actions.moveY) > 0.1) {
            const torqueAxis = worldRight.scale(-Input.actions.moveY * this.pitchRollForce);
            this.body.torque.vadd(torqueAxis, this.body.torque);
        }

        // MoveX = Roll (Gauche Droit) = Tourne autour du Z (Forward)
        if (Math.abs(Input.actions.moveX) > 0.1) {
            const torqueAxis = worldForward.scale(-Input.actions.moveX * this.pitchRollForce);
            this.body.torque.vadd(torqueAxis, this.body.torque);
        }

        // LookX = Yaw (Rotation de queue) = Tourne autour du Y (Up)
        if (Math.abs(Input.actions.lookX) > 0.1) {
            // Note: Normalement c'est des pedales (Q/D au lieu de souris, selon config)
            const torqueAxis = worldUp.scale(-Math.sign(Input.actions.lookX) * this.yawForce);
            this.body.torque.vadd(torqueAxis, this.body.torque);
        }
    }

    _applyAeroForces() {
        if (this.enginePower > 0.05) {
            // Force de Portance pure (Toujours appliquée selon le vecteur UP LOCAL de l'hélico)
            // C'est ça qui fait que si on "pitch" l'helico en avant, la force part en avant + en haut, le faisant avancer!
            const localUp = new Physics.cannon.Vec3(0, 1, 0);
            const worldUp = this.body.quaternion.vmult(localUp);

            const liftMagn = this.maxLiftForce * this.enginePower;
            const liftForceVec = worldUp.scale(liftMagn);

            // Applique la fore sur le centre de masse
            this.body.applyForce(liftForceVec, this.body.position);
        }

        // Stabilisateur auto (Force l'hélico à se remettre à plat (Pitch 0 / Roll 0) sans inputs)
        // Utile en mode arcade, désactivé en mode simu.
        if (this.isPlayerDriving && Input.actions.moveY === 0 && Input.actions.moveX === 0) {
            const currentQuat = new THREE.Quaternion(this.body.quaternion.x, this.body.quaternion.y, this.body.quaternion.z, this.body.quaternion.w);
            const euler = new THREE.Euler().setFromQuaternion(currentQuat, 'YXZ');

            // On exerce de la torque inverse pour annuler le X (Pitch) et Z (Roll)
            const rightVector = this.body.quaternion.vmult(new Physics.cannon.Vec3(1, 0, 0));
            const forwardVector = this.body.quaternion.vmult(new Physics.cannon.Vec3(0, 0, 1));

            // Correction Pitch
            const pTorque = rightVector.scale(-euler.x * this.pitchRollForce * 0.5);
            this.body.torque.vadd(pTorque, this.body.torque);

            // Correction Roll
            const rTorque = forwardVector.scale(-euler.z * this.pitchRollForce * 0.5);
            this.body.torque.vadd(rTorque, this.body.torque);
        }
    }
}
