import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

/**
 * LIFE RPG - Residential Area (Japantown / Little China blend)
 * Zone dense de moyenne hauteur. Beaucoup de petits commerces au sol,
 * appartements tassés, et néons bariolés. Typique "Cyberpunk City".
 */
export class ResidentialArea {
    constructor() {
        this.id = 'residential';
        this.name = 'Neon Residential District';
        this.center = { x: -2000, z: -1000 };
        this.radius = 1800;

        this.genParams = {
            minHeight: 30,
            maxHeight: 120,
            buildingDensity: 0.95, // Très tassé, peu de rues larges
            roadDensity: 0.05,
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9, metalness: 0.1 }), // Concrete
                new THREE.MeshStandardMaterial({ color: 0x554444, roughness: 0.8, metalness: 0.2 }), // Brick-like dark
            ],
            neonColors: [0xff00aa, 0x00ffaa, 0xff0000, 0x0000ff, 0xffff00] // Toutes les couleurs criardes
        };

        this.spawnRules = {
            pedestrians: ['civilian_asian', 'gang_member', 'merc', 'joytoy'],
            vehicles: ['compact_car', 'sport_bike', 'noodle_truck'],
            factions: ['Tyger Claws (Mock)', 'Mox (Mock)']
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Hauteur moyenne avec beaucoup de variations
        const height = this.genParams.minHeight + (Math.random() * (this.genParams.maxHeight - this.genParams.minHeight));

        const mat = this.genParams.materials[Math.floor(Math.random() * this.genParams.materials.length)];
        const geo = new THREE.BoxGeometry(width * 0.8, height, depth * 0.8);
        geo.translate(0, height / 2, 0);

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Beaucoup plus de néons verticaux sur les cotés (Style Tokyo)
        const numNeons = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < numNeons; i++) {
            const neonMat = new THREE.MeshBasicMaterial({
                color: this.genParams.neonColors[Math.floor(Math.random() * this.genParams.neonColors.length)]
            });
            // Longue bande néon verticale
            const neonGeo = new THREE.BoxGeometry(0.5, height * 0.4, 1);
            const neonMesh = new THREE.Mesh(neonGeo, neonMat);

            // Placer aléatoirement sur la face avant ou les côtés bas
            const sideY = Math.random() * height * 0.8;
            neonMesh.position.set((width * 0.8 / 2) + 0.5, sideY, (Math.random() - 0.5) * depth);
            mesh.add(neonMesh);
        }

        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3((width * 0.8) / 2, height / 2, (depth * 0.8) / 2));
        const body = new Physics.cannon.Body({ mass: 0 }); // Static
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh, body };
    }

    onEnter() {
        console.log(`[ZONE] Entered ${this.name}`);
        // TODO: Plus de pluie, filtre violet/magenta, bruits de foule et de pluie
    }

    onExit() {
        console.log(`[ZONE] Exited ${this.name}`);
    }
}
