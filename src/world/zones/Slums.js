import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

/**
 * LIFE RPG - The Slums / Combat Zone
 * Quartiers abandonnés, délabrés. Peu d'éclairage public, routes déformées.
 */
export class Slums {
    constructor() {
        this.id = 'slums';
        this.name = 'Pacifica / Slums';
        this.center = { x: 3000, z: -1000 };
        this.radius = 1500;

        this.genParams = {
            minHeight: 10,
            maxHeight: 40,
            buildingDensity: 0.6, // Plus d'espace libre / ruines
            roadDensity: 0.4,
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x443322, roughness: 1.0, metalness: 0.0 }), // Rust
                new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, metalness: 0.0 }), // Charred Wood/Concrete
            ],
            neonColors: [0xffaa00, 0xff0000] // Feu de camp, vieux gyrophare
        };

        this.spawnRules = {
            pedestrians: ['homeless', 'junkie', 'heavy_gang_member'],
            vehicles: ['rust_bike', 'beat_up_truck', 'armored_van'],
            factions: ['Maelstrom (Mock)', 'Voodoo Boys (Mock)']
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Petits batiments, souvent incomplets ou empilés de manière chaotique
        const height = this.genParams.minHeight + (Math.random() * (this.genParams.maxHeight - this.genParams.minHeight));

        const mat = this.genParams.materials[Math.floor(Math.random() * this.genParams.materials.length)];
        const geo = new THREE.BoxGeometry(width, height, depth);

        // Simuler des bâtiments en ruine (Décalage de la géométrie, ou scale plus étroit en haut)
        const topScale = 0.5 + Math.random() * 0.5;
        // On ne fait pas de modification topologique complexe ici pour rester rapide, on utilise juste 2 box au lieu d'1

        geo.translate(0, height / 2, 0);

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (Math.random() > 0.8) {
            // Feu de poubelle (PointLight orange) au sol
            const light = new THREE.PointLight(0xff6600, 1, 20);
            light.position.set(width * 0.4, 1, depth * 0.4);
            mesh.add(light);
        }

        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3(width / 2, height / 2, depth / 2));
        const body = new Physics.cannon.Body({ mass: 0 }); // Static
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh, body };
    }

    onEnter() {
        console.log(`[ZONE] Entered ${this.name}`);
        // TODO: Filtre orangé/rouille, bruit de sirènes lointain
    }

    onExit() {
        console.log(`[ZONE] Exited ${this.name}`);
    }
}
