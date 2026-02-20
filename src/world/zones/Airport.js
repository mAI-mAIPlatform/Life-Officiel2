import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

export class Airport {
    constructor() {
        this.id = 'airport';
        this.name = 'International Orbital Port';
        this.center = { x: -5000, z: -5000 };
        this.radius = 2500;

        this.genParams = {
            minHeight: 1,
            maxHeight: 2,
            buildingDensity: 0.2, // Vide, grandes pistes
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 }) // Tarmac
            ]
        };

        this.spawnRules = {
            pedestrians: ['traveler', 'security'],
            vehicles: ['taxi', 'shuttle', 'luggage_cart']
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Principalement des grandes dalles plates (Pistes)
        const isTerminal = noiseVal > 0.8;

        let height = 0.5;
        let pWidth = width;
        let pDepth = depth;

        if (isTerminal) {
            height = 30;
            pWidth = width * 0.9;
        }

        const geo = new THREE.BoxGeometry(pWidth, height, pDepth);
        geo.translate(0, height / 2, 0);

        const mat = isTerminal
            ? new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.4 })
            : this.genParams.materials[0];

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z);

        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3(pWidth / 2, height / 2, pDepth / 2));
        const body = new Physics.cannon.Body({ mass: 0 });
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh, body };
    }

    onEnter() { console.log(`Entered ${this.name}`); }
    onExit() { }
}
