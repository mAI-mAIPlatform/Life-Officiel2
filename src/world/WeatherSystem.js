import * as THREE from 'three';
import { Engine } from '../core/Engine.js';
import { MathUtils } from '../utils/MathUtils.js';

export class WeatherEngine {
    constructor() {
        this.particleSystem = null;
        this.geom = null;

        this.weatherTypes = ['CLEAR', 'RAIN', 'FOG', 'ACID_RAIN'];
        this.currentWeather = 'CLEAR';

        this.particleCount = 10000;
        this.velocities = [];
    }

    init() {
        // Prépare le nuage de points de pluie de manière optimisée (Une seule fois)
        this.geom = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);

        for (let i = 0; i < this.particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 400;     // x (-200..200)
            positions[i * 3 + 1] = Math.random() * 200;         // y (0..200)
            positions[i * 3 + 2] = (Math.random() - 0.5) * 400; // z (-200..200)

            this.velocities.push({
                y: -1.0 - Math.random() * 2.0, // Vitesse chute
                x: (Math.random() - 0.5) * 0.2 // Vent léger
            });
        }

        this.geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: 0x88bbff,
            size: 0.5,
            transparent: true,
            opacity: 0, // Caché de base
            blending: THREE.AdditiveBlending
        });

        this.particleSystem = new THREE.Points(this.geom, mat);

        // Le nuage de pluie suit la caméra d'en haut
        if (Engine.camera) {
            Engine.camera.add(this.particleSystem);
        }
    }

    setWeather(type) {
        if (!this.weatherTypes.includes(type)) return;
        this.currentWeather = type;

        if (type === 'CLEAR') {
            this.particleSystem.material.opacity = MathUtils.lerp(this.particleSystem.material.opacity, 0.0, 0.1);
        } else if (type === 'RAIN') {
            this.particleSystem.material.color.setHex(0x88bbff);
            this.particleSystem.material.opacity = MathUtils.lerp(this.particleSystem.material.opacity, 0.6, 0.1);
        } else if (type === 'ACID_RAIN') {
            this.particleSystem.material.color.setHex(0xbcff40); // Vert fluo
            this.particleSystem.material.opacity = MathUtils.lerp(this.particleSystem.material.opacity, 0.8, 0.1);
        }
    }

    update(dt) {
        if (this.currentWeather !== 'RAIN' && this.currentWeather !== 'ACID_RAIN') return;

        if (!this.geom) return;

        const positions = this.geom.attributes.position.array;

        for (let i = 0; i < this.particleCount; i++) {
            // Applique vélocité
            positions[i * 3] += this.velocities[i].x;
            positions[i * 3 + 1] += this.velocities[i].y;

            // Loop si sous le sol
            if (positions[i * 3 + 1] < -10) {
                positions[i * 3 + 1] = 200;
                positions[i * 3] += (Math.random() - 0.5) * 10; // Remue legerement en X au spawn
            }
        }

        this.geom.attributes.position.needsUpdate = true;
    }
}

export const WeatherSystem = new WeatherEngine();
