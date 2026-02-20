import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

/**
 * LIFE RPG - Industrial Zone
 * Usines pétrochimiques, entrepôts massifs, pipelines, containers.
 * Architecture plate et très large. Moins de PNJ, plus mécanique.
 */
export class IndustrialZone {
    constructor() {
        this.id = 'industrial';
        this.name = 'All Food / Petrochem Zone';
        this.center = { x: -3000, z: 2000 };
        this.radius = 2000;

        this.genParams = {
            minHeight: 15,
            maxHeight: 60,
            buildingDensity: 0.5, // Très large
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.8, metalness: 0.5 }), // Corrugated Metal
                new THREE.MeshStandardMaterial({ color: 0x883311, roughness: 0.6, metalness: 0.8 }), // Rusted Iron
            ]
        };

        this.spawnRules = {
            pedestrians: ['factory_worker', 'guard_mech'],
            vehicles: ['delivery_truck', 'heavy_loader', 'forklift'],
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // En industriel, la base (width/depth) est multipliée artificiellement (on groupe les chunks) ou on ignore la rue parfois.
        // Ici, un seul gros entrepôt qui prend presque toute la place
        const height = this.genParams.minHeight + (Math.random() * (this.genParams.maxHeight - this.genParams.minHeight));

        const mat = this.genParams.materials[Math.floor(Math.random() * this.genParams.materials.length)];

        // Forme d'usine, on ajoute des cylindres sur le toit (Cheminées / Cuves)
        const group = new THREE.Group();
        group.position.set(x, 0, z); // Repere global pour ce block

        const baseGeo = new THREE.BoxGeometry(width * 0.9, height, depth * 0.9);
        baseGeo.translate(0, height / 2, 0);
        const baseMesh = new THREE.Mesh(baseGeo, mat);
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Cheminées Smoke Stacks
        if (Math.random() > 0.3) {
            const cylGeo = new THREE.CylinderGeometry(2, 2, height * 0.5);
            cylGeo.translate(0, height * 1.25, 0);
            const cylMesh = new THREE.Mesh(cylGeo, mat);
            cylMesh.position.set(-width * 0.2, 0, -depth * 0.2); // Sur le coin
            group.add(cylMesh);
            // TODO: Ajouter event/particles pour cracher de la fumée noire !
        }

        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3((width * 0.9) / 2, height / 2, (depth * 0.9) / 2));
        const body = new Physics.cannon.Body({ mass: 0 }); // Static
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh: group, body }; // On passe bien un THREE.Group comme un mesh parent
    }

    onEnter() {
        console.log(`[ZONE] Entered ${this.name}`);
        // TODO: Ciel jaunâtre polluer (Brouillard Acide épais), bruits mecaniques sourds
    }

    onExit() { }
}
