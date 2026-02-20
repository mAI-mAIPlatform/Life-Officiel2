import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

export class MilitaryBase {
    constructor() {
        this.id = 'military';
        this.name = 'Militech Restricted Base';
        this.center = { x: -6000, z: 3000 };
        this.radius = 1500;

        this.genParams = {
            minHeight: 10,
            maxHeight: 25,
            buildingDensity: 0.5,
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x3b4d3a, roughness: 0.9 }), // Olive Drab Green
                new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7 })  // Concrete bunker
            ]
        };

        this.spawnRules = {
            pedestrians: ['soldier', 'mech'],
            vehicles: ['apc', 'tank', 'jeep']
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Bunkers et hangars plats mais larges
        const height = this.genParams.minHeight + (Math.random() * (this.genParams.maxHeight - this.genParams.minHeight));

        const mat = this.genParams.materials[Math.floor(Math.random() * this.genParams.materials.length)];
        const geo = new THREE.BoxGeometry(width * 0.8, height, depth * 0.8);
        geo.translate(0, height / 2, 0);

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z);

        // Ligne d'avertissement rouge
        const borderMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const borderGeo = new THREE.BoxGeometry(width * 0.82, 0.5, depth * 0.82);
        const borderMesh = new THREE.Mesh(borderGeo, borderMat);
        borderMesh.position.set(0, height - 1, 0);
        mesh.add(borderMesh);

        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3((width * 0.8) / 2, height / 2, (depth * 0.8) / 2));
        const body = new Physics.cannon.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh, body };
    }

    onEnter() { console.log(`Entered ${this.name} - WANTED LEVEL MAXIMUM AVOID INTERACTION`); }
    onExit() { }
}
