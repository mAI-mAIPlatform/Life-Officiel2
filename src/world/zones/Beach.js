import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

export class Beach {
    constructor() {
        this.id = 'beach';
        this.name = 'Pacifica Beach';
        this.center = { x: 0, z: 8000 };
        this.radius = 2000;

        this.genParams = {
            materials: [
                new THREE.MeshStandardMaterial({ color: 0xeeccaa, roughness: 1.0 }) // Sable de plage
            ]
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Cabanes de plage, parasols, ou juste du plat
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        if (Math.random() > 0.8) {
            // Parasol
            const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 3);
            poleGeo.translate(0, 1.5, 0);
            const pole = new THREE.Mesh(poleGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
            group.add(pole);

            const topGeo = new THREE.ConeGeometry(2, 0.5, 8);
            topGeo.translate(0, 3, 0);
            const top = new THREE.Mesh(topGeo, new THREE.MeshStandardMaterial({ color: 0xff0000 }));
            group.add(top);
        }

        return { mesh: group, body: null };
    }

    onEnter() { }
    onExit() { }
}
