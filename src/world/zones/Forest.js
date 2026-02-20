import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

export class Forest {
    constructor() {
        this.id = 'forest';
        this.name = 'Redwood Reserve';
        this.center = { x: 6000, z: -5000 };
        this.radius = 3000;

        this.genParams = {
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x3a2211, roughness: 1.0 }), // Tronc
                new THREE.MeshStandardMaterial({ color: 0x116622, roughness: 0.9 })  // Feuilles
            ]
        };

        this.spawnRules = {}; // Animaux ?
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Au lieu de bâtiment, on fait des Arbres!
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const trunkHeight = 10 + Math.random() * 20;

        const trunkGeo = new THREE.CylinderGeometry(1, 1.5, trunkHeight);
        trunkGeo.translate(0, trunkHeight / 2, 0);
        const trunkMesh = new THREE.Mesh(trunkGeo, this.genParams.materials[0]);
        trunkMesh.castShadow = true;
        group.add(trunkMesh);

        const leavesGeo = new THREE.ConeGeometry(5 + Math.random() * 5, 10 + Math.random() * 10);
        leavesGeo.translate(0, trunkHeight + 5, 0);
        const leavesMesh = new THREE.Mesh(leavesGeo, this.genParams.materials[1]);
        leavesMesh.castShadow = true;
        group.add(leavesMesh);

        const shape = new Physics.cannon.Cylinder(1, 1.5, trunkHeight, 8);
        const body = new Physics.cannon.Body({ mass: 0 });
        body.addShape(shape);
        // Quaternion pour redresser le cylinder dans cannonjs
        body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        body.position.set(x, trunkHeight / 2, z);

        return { mesh: group, body };
    }

    onEnter() { }
    onExit() { }
}
