import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';
import { Engine } from '../../core/Engine.js';
import { Input } from '../../core/InputHandler.js';

/**
 * LIFE RPG - Small Recon Drone
 * Quadcoptère très maniable, avec une caméra associée que le joueur 
 * contrôle à distance via le mOS.
 */
export class DroneController {
    constructor(startPosition = new THREE.Vector3(0, 3, 0)) {
        this.id = 'drone_' + Math.random().toString(36).substr(2, 9);

        this.isActive = false;
        this.maxSpeed = 15; // m/s
        this.acceleration = 30;

        // Outil : Pas de physics pure pour le drone. Il vole via pure vélocité cinématique
        // pour une précision au poil sans inertie massive, avec raycasts de collision.
        this.velocity = new THREE.Vector3();
        this.meshGroup = new THREE.Group();
        this.meshGroup.position.copy(startPosition);

        // Physique Sphere pour les collisions d'obsctable (Rebond)
        this.body = new Physics.cannon.Body({
            mass: 2,
            shape: new Physics.cannon.Sphere(0.3),
            position: new Physics.cannon.Vec3(startPosition.x, startPosition.y, startPosition.z),
            linearDamping: 0.9,
            angularDamping: 0.9
        });
        Physics.world.addBody(this.body);

        this._buildVisuals();
    }

    _buildVisuals() {
        // Base Unit
        const centerGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 8);
        const mat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9 });
        const center = new THREE.Mesh(centerGeo, mat);
        this.meshGroup.add(center);

        // Bras
        const armGeo = new THREE.BoxGeometry(0.8, 0.05, 0.05);
        const arm1 = new THREE.Mesh(armGeo, mat);
        arm1.rotation.y = Math.PI / 4;
        this.meshGroup.add(arm1);

        const arm2 = new THREE.Mesh(armGeo, mat);
        arm2.rotation.y = -Math.PI / 4;
        this.meshGroup.add(arm2);

        // Oeil Caméra (Rouge lumineux)
        const eyeGeo = new THREE.SphereGeometry(0.08, 8, 8);
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000 });
        this.eyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
        this.eyeMesh.position.set(0, -0.05, 0.15); // Devant en bas
        this.meshGroup.add(this.eyeMesh);

        Engine.scene.add(this.meshGroup);
    }

    activate() {
        this.isActive = true;
        // La caméra Engine principale passe POV du drone
        // En vrai: RenderTarget picture in picture sur la tablette du mOS, 
        // ou takeover complet l'écran et appliquer des shaders scanline verdâtres.
    }

    deactivate() {
        this.isActive = false;
        // On rends la vue au joueur
    }

    update(dt) {
        // Sync Mesh = Physics Body
        this.meshGroup.position.copy(this.body.position);
        this.meshGroup.quaternion.copy(this.body.quaternion);

        if (!this.isActive) {
            // Maintien son altitude auto si personne ne controle
            const targetY = this.body.position.y;
            this.body.applyForce(new Physics.cannon.Vec3(0, 2 * 9.81, 0), this.body.position);
            return;
        }

        // --- Contrôles Arcade --- 
        let thrustY = 0;
        if (Input.actions.sprint) thrustY = 1;
        if (Input.actions.crouch) thrustY = -1;

        // Force anti-gravité de base (Hover) + Input vertical
        const liftMagn = (2 * 9.81) + (thrustY * this.acceleration * 2);
        this.body.applyForce(new Physics.cannon.Vec3(0, liftMagn, 0), this.body.position);

        // Horizontal Movement (relatif a la camera/rotation)
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.meshGroup.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.meshGroup.quaternion);

        forward.multiplyScalar(-Input.actions.moveY);
        right.multiplyScalar(Input.actions.moveX);

        const movDir = new THREE.Vector3().addVectors(forward, right).normalize();

        if (movDir.lengthSq() > 0) {
            // Appliquer force XYZ directionnelle
            const forceVec = new Physics.cannon.Vec3(
                movDir.x * this.acceleration * 2,
                0,
                movDir.z * this.acceleration * 2
            );
            this.body.applyForce(forceVec, this.body.position);
        }

        // --- Rotation (Yaw) ---
        // Stick droit LookX
        if (Math.abs(Input.actions.lookX) > 0.05) {
            const rotY = -Input.actions.lookX * 10;
            this.body.torque.vadd(new Physics.cannon.Vec3(0, rotY, 0), this.body.torque);
        }

        // --- Inclinaison Factice Visuelle ---
        // Pour faire joli, on incline légerement le mesh dans la direction du mouvement
        const velX = this.body.velocity.x;
        const velZ = this.body.velocity.z;

        // Convertir velocité globale en locale (par rapport au quad)
        const vLocal = new THREE.Vector3(velX, 0, velZ).applyQuaternion(this.meshGroup.quaternion.clone().invert());

        // Max inclinaison: 30 degres = 0.5 rad
        const targetPitch = Math.max(-0.5, Math.min(0.5, vLocal.z * 0.05));
        const targetRoll = Math.max(-0.5, Math.min(0.5, vLocal.x * -0.05));

        // Note: C'est complexe de mixer une rotation physique cannon (Yaw) avec une rotation mesh cosmétique
        // Habituellement on sépare le pivot logic (body) du pivot mesh (group->mesh).
        // Ici on se concentre sur le déplacement.
    }
}
