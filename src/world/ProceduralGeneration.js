import * as THREE from 'three';
import { Physics } from '../core/Physics.js';
import { MathUtils } from '../utils/MathUtils.js';

/**
 * LIFE RPG - Procedural Generation
 * Génère des bâtiments, routes et props dynamiquement lors du chargement
 * d'un chunk si aucun prefab JSON fixe n'est défini.
 * Utilise le Perlin Noise pour définir la densité architecturale.
 */
class ProceduralGenSystem {
    constructor() {
        this.seed = 1337;
        // Types de zones: 0 = nature/vide, 0.3 = banlieue, 0.6 = commercial, 0.8 = centre-ville
    }

    /**
     * Génère le contenu d'un chunk de taille N
     * @param {number} cx Index X du chunk 
     * @param {number} cz Index Z du chunk
     * @param {number} size Taille en metres
     * @returns {Object} { group: THREE.Group, bodies: Array }
     */
    generateChunk(cx, cz, size) {
        const group = new THREE.Group();
        const bodies = [];

        // Position monde réelle du coin en bas à gauche du chunk
        const startX = cx * size;
        const startZ = cz * size;

        // Découper le chunk en sous-cellules (ex: blocs de 40x40m)
        const cellSize = 40;
        const cellsPerAxis = Math.floor(size / cellSize);

        for (let i = 0; i < cellsPerAxis; i++) {
            for (let j = 0; j < cellsPerAxis; j++) {
                // Coordonnée centre de cette cellule
                const worldX = startX + (i * cellSize) + (cellSize / 2);
                const worldZ = startZ + (j * cellSize) + (cellSize / 2);

                // Sample le bruit de perlin pour cette coordonnée (Détermine le type de bâtiment)
                // MathUtils.perlin2D n'étant pas obligatoirement implémenté, on mock avec un Math.abs(sin)
                const noiseVal = Math.abs(Math.sin((worldX + this.seed) * 0.005) * Math.cos((worldZ + this.seed) * 0.005));

                // Si très bas = route ou place vide. Sinon batiment.
                if (noiseVal > 0.2) {
                    const { mesh, body } = this._buildSkyscraper(worldX, worldZ, noiseVal, cellSize);
                    group.add(mesh);
                    if (body) bodies.push(body);
                } else {
                    // Route ou trottoir 
                    // TODO: Asphalt mesh
                }
            }
        }

        return { group, bodies };
    }

    /**
     * Construit un mesh de bâtiment basique + collider
     */
    _buildSkyscraper(x, z, density, cellSize) {
        // Hauteur de 10m (banlieue) à 200m (centre) selon la densité
        const height = 10 + Math.floor(density * 190);
        const width = cellSize * 0.8; // Laisse 10% de marge pour les ruelles
        const depth = cellSize * 0.8;

        // Mesh 
        const geo = new THREE.BoxGeometry(width, height, depth);
        // Translation géométrie pour que le pivot (0) soit à la base du building, pas au centre
        geo.translate(0, height / 2, 0);

        // Couleur random ou basée sur coord (+ vitres emissives factices)
        const isNeon = density > 0.7; // Les gros builings ont du neon
        const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL((x + z) % 1, 0.2, 0.2), // Teinte dark
            roughness: 0.3,
            metalness: 0.8,
            emissive: isNeon ? new THREE.Color().setHSL(density, 1.0, 0.2) : 0x000000
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Physics Body (Static Box)
        // ATTENTION avec Cannon.js : Les boxGemos prennent des halfExtents (largeur / 2)
        const shape = new Physics.cannon.Box(new Physics.cannon.Vec3(width / 2, height / 2, depth / 2));
        const body = new Physics.cannon.Body({ mass: 0 }); // 0 mass = inamovible (bâtiment)
        body.addShape(shape);
        // Position body (Le centre de la boite physique est au centre géometrique)
        body.position.set(x, height / 2, z);

        return { mesh, body };
    }
}

export const ProceduralGenerator = new ProceduralGenSystem();
