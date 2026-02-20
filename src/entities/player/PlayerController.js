import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';
import { Input } from '../../core/InputHandler.js';
import { CameraSystem } from '../../core/CameraManager.js';
import { PlayerConfig } from '../../utils/Constants.js';
import { Engine } from '../../core/Engine.js';

/**
 * LIFE RPG - Player Controller
 * Controleur Cinématique (Kinematic Character Controller).
 * Mouvements FPS/TPS via Physics Cannon.js.
 */
export class PlayerController {
    constructor() {
        this.mesh = null;
        this.physicsBody = null;

        // Vecteurs et Quaternions temporaires pour calculs sans GC
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.euler = new THREE.Euler(0, 0, 0, 'YXZ');

        // États
        this.isGrounded = false;
        this.isSprinting = false;
        this.isCrouching = false;
        this.jumpTimer = 0;
    }

    init(spawnPosition) {
        // --- 1. THREE.JS Mesh (Représentation Visuelle Temporaire) ---
        const height = PlayerConfig.PHYSICS.HEIGHT;
        const radius = PlayerConfig.PHYSICS.RADIUS;
        const geo = new THREE.CapsuleGeometry(radius, height - (radius * 2), 4, 8);
        const mat = new THREE.MeshStandardMaterial({ color: 0x4444aa });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        Engine.scene.add(this.mesh);

        // --- 2. CANNON.JS (Représentation Physique) ---
        // Le Kinematic Character Controller utilise typiquement une sphère ou une capsule.
        // Ici, une sphère (bas) + un cylindre (haut) ou simple sphère pour glisser sur les pentes.
        // On opte pour une sphère de base (Physics.cannon.Sphere) glissante sans friction.
        const shape = new Physics.cannon.Sphere(radius);
        this.physicsBody = new Physics.cannon.Body({
            mass: PlayerConfig.PHYSICS.MASS,
            material: Physics.materials.player,
            fixedRotation: true, // Ne pas rouler comme une boule
            linearDamping: 0.9   // Freinage aérien et horizontal
        });
        this.physicsBody.addShape(shape, new Physics.cannon.Vec3(0, -(height / 2) + radius, 0));

        // On ajoute une 2eme sphère au dessus pour faire une capsule factice
        const shapeTop = new Physics.cannon.Sphere(radius);
        this.physicsBody.addShape(shapeTop, new Physics.cannon.Vec3(0, (height / 2) - radius, 0));

        this.physicsBody.position.copy(spawnPosition);
        Physics.world.addBody(this.physicsBody);

        // --- 3. Synchroniser la Caméra ---
        CameraSystem.setTarget(this.mesh);
    }

    update(dt) {
        if (!this.physicsBody) return;

        // Sync Mesh from Body
        this.mesh.position.copy(this.physicsBody.position);

        // Gère la rotation de la tête (Souris/Joystick droit)
        this._updateRotation();

        // Check if on ground
        this._checkGrounded();

        // Gère le mouvement horizontal (Clavier/Joystick gauche)
        this._updateMovement(dt);

        // Update Caméra (Suit le joueur)
        CameraSystem.update(dt);
    }

    _updateRotation() {
        const sensX = PlayerConfig.CAMERA.SENSITIVITY_X;
        const sensY = PlayerConfig.CAMERA.SENSITIVITY_Y;

        this.euler.y -= Input.actions.lookX * sensX;
        this.euler.x -= Input.actions.lookY * sensY;

        // Clamp Pitch (Regarder en haut / bas)
        this.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.euler.x));

        // Appliquer rotation au Mesh pour qu'il tourne sur lui même
        this.mesh.quaternion.setFromEuler(new THREE.Euler(0, this.euler.y, 0));

        // Et passer à la camera
        CameraSystem.camera.quaternion.setFromEuler(this.euler);
    }

    _checkGrounded() {
        // Raycast vers le bas depuis le centre de la physique
        const start = new Physics.cannon.Vec3().copy(this.physicsBody.position);
        const end = new Physics.cannon.Vec3(start.x, start.y - (PlayerConfig.PHYSICS.HEIGHT / 2) - 0.2, start.z);

        // TODO: Physics.raycast 
        // En attendant une implémentation raycast cannon, on triche avec la velocityY :
        this.isGrounded = Math.abs(this.physicsBody.velocity.y) < 0.1;
    }

    _updateMovement(dt) {
        if (this.jumpTimer > 0) this.jumpTimer -= dt;

        // Vitesse ciblée
        let speed = PlayerConfig.MOVEMENT.WALK_SPEED;
        if (Input.actions.crouch) {
            speed = PlayerConfig.MOVEMENT.CROUCH_SPEED;
            this.isCrouching = true;
            this.isSprinting = false;
        } else if (Input.actions.sprint) {
            speed = PlayerConfig.MOVEMENT.RUN_SPEED;
            this.isSprinting = true;
            this.isCrouching = false;
        } else {
            this.isSprinting = false;
            this.isCrouching = false;
        }

        // --- Jump ---
        if (Input.actions.jump && this.isGrounded && this.jumpTimer <= 0) {
            this.physicsBody.velocity.y = Math.sqrt(2 * 9.81 * PlayerConfig.MOVEMENT.JUMP_FORCE);
            this.jumpTimer = 0.5; // Cooldown
            this.isGrounded = false;
        }

        // --- X / Z Mouvement (Relatif à la rotation de la tête) ---
        // Le vecteur de direction forward de la camera
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, this.euler.y, 0)));
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, this.euler.y, 0)));

        forward.multiplyScalar(-Input.actions.moveY);
        right.multiplyScalar(Input.actions.moveX);

        this.direction.addVectors(forward, right).normalize();

        // Si on touche un input
        if (this.direction.lengthSq() > 0) {
            // Acceleration (Lerp la vélocité courante vers la vélocité désirée pour simuler l'inertie)
            const dVelX = this.direction.x * speed;
            const dVelZ = this.direction.z * speed;

            // On manipule directement la vélocité du Kinematic Character
            if (this.isGrounded) {
                // Contrôle total au sol
                this.physicsBody.velocity.x += (dVelX - this.physicsBody.velocity.x) * 10 * dt;
                this.physicsBody.velocity.z += (dVelZ - this.physicsBody.velocity.z) * 10 * dt;
            } else {
                // Controle en l'air réduit (Air Control)
                this.physicsBody.velocity.x += (dVelX - this.physicsBody.velocity.x) * 2 * dt;
                this.physicsBody.velocity.z += (dVelZ - this.physicsBody.velocity.z) * 2 * dt;
            }
        }

        // Ajustement visuel pour le crouch
        if (this.isCrouching) {
            this.mesh.scale.y = 0.5;
            this.physicsBody.shapes[1].offset.y = 0; // Descend la sphere du haut
        } else {
            this.mesh.scale.y = 1.0;
            this.physicsBody.shapes[1].offset.y = (PlayerConfig.PHYSICS.HEIGHT / 2) - PlayerConfig.PHYSICS.RADIUS;
        }
    }

    getPosition() {
        return this.physicsBody ? this.physicsBody.position : { x: 0, y: 0, z: 0 };
    }

    setPosition(pos) {
        if (this.physicsBody) {
            this.physicsBody.position.copy(pos);
            this.physicsBody.velocity.set(0, 0, 0);
        }
    }
}
