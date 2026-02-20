import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

export class Port {
    constructor() {
        this.id = 'port';
        this.name = 'Night City Docks';
        this.center = { x: 4000, z: 2000 };
        this.radius = 1500;

        this.genParams = {
            minHeight: 5,
            maxHeight: 15,
            buildingDensity: 0.7,
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x992222, roughness: 0.8, metalness: 0.2 }), // Red Container
                new THREE.MeshStandardMaterial({ color: 0x2244aa, roughness: 0.8, metalness: 0.2 }), // Blue Container
                new THREE.MeshStandardMaterial({ color: 0xddaa22, roughness: 0.8, metalness: 0.2 })  // Yellow Container
            ]
        };

        this.spawnRules = {
            pedestrians: ['docker', 'smuggler'],
            vehicles: ['truck', 'forklift']
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // En zone Portuaire, on génère majoritairement des piles de containers
        const mat = this.genParams.materials[Math.floor(Math.random() * this.genParams.materials.length)];

        // Container standard : 2.5m x 2.5m x 6m
        const cWidth = 2.5;
        const cHeight = 2.5;
        const cDepth = 6;

        // On empile 1 à 4 containers
        const stackCount = Math.floor(Math.random() * 4) + 1;
        const height = stackCount * cHeight;

        const group = new THREE.Group();
        group.position.set(x, 0, z);

        for (let i = 0; i < stackCount; i++) {
            const geo = new THREE.BoxGeometry(cWidth, cHeight, cDepth);
            geo.translate(0, cHeight / 2 + (i * cHeight), 0);
            const mesh = new THREE.Mesh(geo, mat);
            group.add(mesh);
        }

        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3(cWidth / 2, height / 2, cDepth / 2));
        const body = new Physics.cannon.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh: group, body };
    }

    onEnter() { console.log(`Entered ${this.name}`); }
    onExit() { }
}
