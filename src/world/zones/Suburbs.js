import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

/**
 * LIFE RPG - The Suburbs / Badlands edge
 * Maisons individuelles avec jardins ou parcs à roulottes, bordant
 * l'extérieur de la ville. Transition Neo-Kitsch.
 */
export class Suburbs {
    constructor() {
        this.id = 'suburbs';
        this.name = 'North Oaks / Suburbs';
        this.center = { x: 0, z: -4000 };
        this.radius = 2000;

        this.genParams = {
            minHeight: 5,
            maxHeight: 15, // Petites maisons 1 à 3 étages
            buildingDensity: 0.3, // Beaucoup d'espace "herbe/désert"
            materials: [
                new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.4, metalness: 0.0 }), // White modern
                new THREE.MeshStandardMaterial({ color: 0xaabbcc, roughness: 0.5, metalness: 0.1 }), // Pastel tones
            ]
        };

        this.spawnRules = {
            pedestrians: ['rich_citizen', 'pet_dog'],
            vehicles: ['suv', 'station_wagon', 'electric_car'],
        };
    }

    generateBuilding(x, z, width, depth, noiseVal) {
        // Au lieu de remplir le bloc, on fait une petite maison au milieu d'un grand block
        const height = this.genParams.minHeight + (Math.random() * (this.genParams.maxHeight - this.genParams.minHeight));

        // Taille maison : max 15x15 au sein de la "cellule" de 40x40
        const mWidth = width * 0.4;
        const mDepth = depth * 0.4;

        const mat = this.genParams.materials[Math.floor(Math.random() * this.genParams.materials.length)];
        const geo = new THREE.BoxGeometry(mWidth, height, mDepth);
        geo.translate(0, height / 2, 0);

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z); // Maison au milieu de la parcelle
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3(mWidth / 2, height / 2, mDepth / 2));
        const body = new Physics.cannon.Body({ mass: 0 }); // Static
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh, body };
    }

    onEnter() {
        console.log(`[ZONE] Entered ${this.name}`);
        // TODO: Filtre clair, ciel pur
    }

    onExit() { }
}
