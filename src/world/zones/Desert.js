import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

export class Desert {
    constructor() {
        this.id = 'desert';
        this.name = 'The Badlands';
        this.center = { x: -8000, z: 2000 };
        this.radius = 4000;

        this.genParams = {
            materials: [
                new THREE.MeshStandardMaterial({ color: 0xccaa77, roughness: 1.0 }) // Sable
            ]
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Juste des dunes très plates, quasi aucun collider saillant
        const height = 2 + Math.random() * 10;
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const rockGeo = new THREE.SphereGeometry(width, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2); // Demi sphere
        rockGeo.scale(1, height / width, 1); // Aplatir en dune
        const mesh = new THREE.Mesh(rockGeo, this.genParams.materials[0]);
        group.add(mesh);

        // Pas de collider bloquant pour le desert
        return { mesh: group, body: null };
    }

    onEnter() { }
    onExit() { }
}
