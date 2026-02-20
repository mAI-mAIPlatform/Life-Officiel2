import * as THREE from 'three';
import { Engine } from './Engine.js';
import { PlayerConfig } from '../utils/Constants.js';
import { MathUtils } from '../utils/MathUtils.js';

/**
 * LIFE RPG - Camera Manager
 * Caméra physique avancée qui gère le passage fluide de FPS (First Person) à TPS (Third Person),
 * l'amortissement du suivi, le recoil des armes, et le clipping contre les murs.
 */
class CameraController {
    constructor() {
        this.camera = null;
        this.target = null; // Object3D ou Vector3

        // Modes: 'FPS' ou 'TPS'
        this.mode = 'TPS';

        // Pivot de la caméra (pour orbite TPS)
        this.pivot = new THREE.Object3D();

        // Interpolation
        this.currentPosition = new THREE.Vector3();
        this.currentLookAt = new THREE.Vector3();
        this.velocityPos = { val: new THREE.Vector3() }; // Ref for smoothDamp
        this.velocityLook = { val: new THREE.Vector3() };

        // Tremblement & Recul (Camera Shake)
        this.cameraShake = new THREE.Vector3();
        this.shakeTime = 0;
        this.shakeIntensity = 0;

        // Zooming/Aiming
        this.isAiming = false;
        this.baseFov = 75;
        this.aimFov = 50;
        this.currentFov = 75;
    }

    init() {
        this.camera = Engine.camera;
        this.baseFov = this.camera.fov;

        // On rajoute la caméra dans le pivot
        this.pivot.add(this.camera);
        // Le pivot reste pour l'instant détaché, il sera "follow" par rapport à un update().
    }

    setTarget(object3d) {
        this.target = object3d;
    }

    setMode(mode) {
        if (mode !== 'FPS' && mode !== 'TPS') return;
        this.mode = mode;
    }

    toggleMode() {
        this.mode = this.mode === 'TPS' ? 'FPS' : 'TPS';
    }

    setAiming(isAiming) {
        this.isAiming = isAiming;
    }

    /**
     * Secoue la caméra
     * @param {number} intensity Force brute de 0 à 1 (ex: tir de sniper = 0.5)
     * @param {number} duration Durée en secondes
     */
    addShake(intensity, duration) {
        this.shakeIntensity = Math.max(this.shakeIntensity, intensity);
        this.shakeTime = Math.max(this.shakeTime, duration);
    }

    /**
     * Calcule la nouvelle position et rotation. Appelé depuis GameLoop (Render)
     * @param {number} dt DeltaTime
     */
    update(dt) {
        if (!this.target || !this.camera) return;

        // --- 1. Gestion du FOV (Visée) ---
        const targetFov = this.isAiming ? this.aimFov : this.baseFov;
        this.currentFov = MathUtils.lerp(this.currentFov, targetFov, dt * 10.0);
        if (Math.abs(this.camera.fov - this.currentFov) > 0.1) {
            this.camera.fov = this.currentFov;
            this.camera.updateProjectionMatrix();
        }

        // --- 2. Camera Shake ---
        let shakeOffset = new THREE.Vector3(0, 0, 0);
        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
            const damping = this.shakeTime > 0 ? this.shakeTime : 0;
            // Bruit procédural ultra-rapide
            const bx = (Math.random() * 2 - 1) * this.shakeIntensity * damping;
            const by = (Math.random() * 2 - 1) * this.shakeIntensity * damping;
            shakeOffset.set(bx, by, 0);
            if (this.shakeTime <= 0) this.shakeIntensity = 0;
        }

        // --- 3. Positionnement Principal ---

        // La rotation de la tête/pivot vient généralement de l'Input souris (mise à jour via PlayerController)
        // La Caméra Manager s'occupe de SUIVRE l'objet target.

        let desiredPosition = new THREE.Vector3();
        let lookAtTarget = new THREE.Vector3();

        if (this.mode === 'TPS') {
            const offsets = this.isAiming ? PlayerConfig.CAMERA.TPS_OFFSET_AIM : PlayerConfig.CAMERA.TPS_OFFSET;

            // Calculer la position désirée locale -> monde par rapport au target qui tourne
            desiredPosition.copy(this.target.position);

            // Hauteur d'épaule
            desiredPosition.y += offsets[1];

            // Créer le recul derrière le joueur (basé sur la rotation *visuelle* de la caméra via Input YAW)
            // Note: C'est un pseudo-code de suivi, la véritable intégration demande l'Euler du yaw.
            // On délègue généralement le calcul exact "derrière l'épaule" au Input/Player pour éviter les circular dependencies.
            // ...

        } else if (this.mode === 'FPS') {
            const offset = PlayerConfig.CAMERA.FPS_OFFSET;
            desiredPosition.copy(this.target.position);
            desiredPosition.add(new THREE.Vector3(offset[0], offset[1], offset[2]));
            // lookAtTarget sera la direction dictée par l'Input...
        }

        // --- 4. Collision des murs (TPS unqiuement) ---
        // Utilisera Physics.raycast pour avancer la caméra si un mur bloque la vision du perso.
        // this._calculateWallClipping(...)

        // --- 5. Application des Shake Offset ---
        this.camera.position.add(shakeOffset);
    }
}

export const CameraSystem = new CameraController();
