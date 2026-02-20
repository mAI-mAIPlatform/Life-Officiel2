import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';

/**
 * LIFE RPG - Financial District Zone
 * Définit les règles de génération spécifiques pour le centre d'affaires (Corpo Plaza).
 * Utilise des immenses tours de verre avec beacuoup de réflexions, des néons blancs/bleus,
 * et un trafic composé de véhicules de luxe et de drones corpo.
 */
export class FinancialDistrict {
    constructor() {
        this.id = 'financial';
        this.name = 'Financial District';
        this.center = { x: 0, z: 0 };
        this.radius = 2000;

        // Paramètres de procedural generation pour cette zone
        this.genParams = {
            minHeight: 100,
            maxHeight: 500,
            buildingDensity: 0.9,
            roadDensity: 0.1,
            materials: [
                new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1, envMapIntensity: 1.0 }), // Black Glass
                new THREE.MeshStandardMaterial({ color: 0x223344, metalness: 0.8, roughness: 0.2, envMapIntensity: 1.0 }), // Blue Glass
                new THREE.MeshStandardMaterial({ color: 0xeeddcc, metalness: 0.3, roughness: 0.7 }) // White Marble Base
            ],
            neonColors: [0xffffff, 0x00f3ff, 0x0055ff] // Classe
        };

        // Entités Spawns
        this.spawnRules = {
            pedestrians: ['corpo_suit', 'corpo_sec', 'tourist_rich'],
            vehicles: ['levitation_car', 'luxury_sedan', 'corpo_transporter'],
            factions: ['Arasaka', 'Militech'] // Mock
        };
    }

    /**
     * Surcharge le générateur générique pour ce quartier lors de la création d'un chunk
     */
    generateBuilding(x, z, width, depth, noiseVal) {
        // En Override, tous les bâtiments ici sont très hauts
        const height = this.genParams.minHeight + (Math.random() * (this.genParams.maxHeight - this.genParams.minHeight));

        // Choisit un materiel au pif
        const mat = this.genParams.materials[Math.floor(Math.random() * this.genParams.materials.length)];
        const geo = new THREE.BoxGeometry(width * 0.95, height, depth * 0.95);
        geo.translate(0, height / 2, 0);

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Ajouter un billboard néon aléatoire au sommet (Logo corpo fictif)
        if (Math.random() > 0.5) {
            const neonMat = new THREE.MeshBasicMaterial({
                color: this.genParams.neonColors[Math.floor(Math.random() * this.genParams.neonColors.length)]
            });
            const neonGeo = new THREE.PlaneGeometry(width, height * 0.1);
            const neonMesh = new THREE.Mesh(neonGeo, neonMat);
            neonMesh.position.set(0, height - (height * 0.05) + 1, (depth / 2) * 0.96); // Collé à la face avant
            mesh.add(neonMesh);
        }

        // Physique
        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3((width * 0.95) / 2, height / 2, (depth * 0.95) / 2));
        const body = new Physics.cannon.Body({ mass: 0 }); // Static
        body.addShape(shape);
        body.position.set(x, height / 2, z);

        return { mesh, body };
    }

    /**
     * Appelé quand le joueur entre dans la zone
     */
    onEnter() {
        console.log(`[ZONE] Entered ${this.name}`);
        // TODO: Changer le post-processing (plus de bloom, filtre bleu froid)
        // TODO: Changer la musique ambiante pour de la Synthwave orchestrale lourde
    }

    /**
     * Appelé quand le joueur sort de la zone
     */
    onExit() {
        console.log(`[ZONE] Exited ${this.name}`);
    }
}
