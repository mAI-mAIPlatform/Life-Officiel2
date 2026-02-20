import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

export class Mountains {
    constructor() {
        this.id = 'mountains';
        this.name = 'The High Peaks';
        this.center = { x: 8000, z: 8000 };
        this.radius = 4000;

        this.genParams = {
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 1.0 }) // Roche
            ]
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Créer d'immenses structures coniques rocheuses comme montagnes placeholder
        const height = 100 + Math.random() * 400;
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const rockGeo = new THREE.ConeGeometry(width * 1.5, height, 4); // Pyramides grossières
        rockGeo.translate(0, height / 2, 0);
        const mesh = new THREE.Mesh(rockGeo, this.genParams.materials[0]);
        group.add(mesh);

        // Approximation Physics avec une boite pour aller vite
        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3(width * 0.8, height / 2, width * 0.8));
        const body = new Physics.cannon.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh: group, body };
    }

    onEnter() { }
    onExit() { }
}
