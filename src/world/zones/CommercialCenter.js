import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

export class CommercialCenter {
    constructor() {
        this.id = 'commercial';
        this.name = 'City Center / Commercial';
        this.center = { x: 1000, z: -1000 };
        this.radius = 1200;

        this.genParams = {
            minHeight: 30,
            maxHeight: 150,
            buildingDensity: 0.85,
            materials: [
                new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.4, metalness: 0.3 }),
                new THREE.MeshStandardMaterial({ color: 0x88bbff, roughness: 0.2, metalness: 0.8, transparent: true, opacity: 0.8 }) // Glass
            ]
        };

        this.spawnRules = {
            pedestrians: ['shopper', 'corpo_low', 'tourist'],
            vehicles: ['taxi', 'sedan', 'sports_car']
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        const height = this.genParams.minHeight + (Math.random() * (this.genParams.maxHeight - this.genParams.minHeight));
        const mat = this.genParams.materials[Math.floor(Math.random() * this.genParams.materials.length)];

        // Forme basique Mega-Mall ou Tour
        const geo = new THREE.BoxGeometry(width * 0.9, height, depth * 0.9);
        geo.translate(0, height / 2, 0);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z);

        // Ground Floor Emissive Shop Windows
        const shopMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const shopGeo = new THREE.PlaneGeometry(width * 0.8, 5);
        const shopMesh = new THREE.Mesh(shopGeo, shopMat);
        shopMesh.position.set(0, 2.5, (depth * 0.45) + 0.1);
        mesh.add(shopMesh);

        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3((width * 0.9) / 2, height / 2, (depth * 0.9) / 2));
        const body = new Physics.cannon.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh, body };
    }

    onEnter() { console.log(`Entered ${this.name}`); }
    onExit() { }
}
