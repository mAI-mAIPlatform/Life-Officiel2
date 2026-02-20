import * as THREE from 'three';
import { Engine } from '../core/Engine.js';
import { Physics } from '../core/Physics.js';
import { WorldConfig } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';
import { MathUtils } from '../utils/MathUtils.js';

/**
 * LIFE RPG - World Manager
 * Gère le cycle de vie du monde : Instantiation du ciel, du sol, 
 * brouillard, et chargement/déchargement des chunks de la ville (Streaming).
 */
class WorldSystem {
    constructor() {
        this.scene = null;
        this.worldGroup = new THREE.Group();

        // Chunk Management (Streaming)
        this.chunks = new Map(); // id -> ChunkObject
        this.currentChunkId = null;
        this.renderDistance = WorldConfig.RENDER_DISTANCE;
        this.chunkSize = WorldConfig.CHUNK_SIZE;

        // Environment
        this.skyMaterial = null;
        this.sunLight = null;
        this.ambientLight = null;
        this.moonLight = null;

        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        this.scene = Engine.scene;
        this.scene.add(this.worldGroup);

        this._setupLighting();
        this._setupSky();
        this._setupFog();
        this._setupBaseGround();

        this.isInitialized = true;
        Logger.info('World', 'World System Initialisé.');
    }

    _setupLighting() {
        // Lumière Ambiante de base (faible, bleue marine pour la nuit/ombres)
        this.ambientLight = new THREE.AmbientLight(0x0a1128, 0.2);
        this.scene.add(this.ambientLight);

        // Soleil (DirectionalLight principale, produisant des ombres)
        this.sunLight = new THREE.DirectionalLight(0xfff0dd, 2.0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 4096; // Haute resol pour la ville
        this.sunLight.shadow.mapSize.height = 4096;
        this.sunLight.shadow.camera.near = 1;
        this.sunLight.shadow.camera.far = 1000;

        // Zone d'ombre dynamique (à lier à la camera du joueur plus tard pour de meilleures perfs)
        const d = 200;
        this.sunLight.shadow.camera.left = -d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = -d;
        this.sunLight.shadow.bias = -0.0005;

        // Pos initiale (Midi approximatif)
        this.sunLight.position.set(100, 200, 50);
        this.scene.add(this.sunLight);

        // Lune (Bleu pale, pas d'ombres pour opti)
        this.moonLight = new THREE.DirectionalLight(0x88bbff, 0.0);
        this.moonLight.position.set(-100, -200, -50);
        this.scene.add(this.moonLight);
    }

    _setupSky() {
        // En attendant un shader complexe, on utilise un dôme avec vertex colors ou simple materiel
        // On utilisera scene.background = Color ou scene.environment
        this.scene.background = new THREE.Color(0x87CEEB); // Bleu ciel par defaut
    }

    _setupFog() {
        // Brouillard exponentiel (Cyberpunk atmoshepre)
        // La couleur du brouillard devra s'adapter à l'heure du jour
        this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.002);
    }

    _setupBaseGround() {
        // Sol de base infini visuellement
        const geo = new THREE.PlaneGeometry(10000, 10000);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(geo, mat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.worldGroup.add(ground);

        // Sol physique invisible mais solide pour tout le monde
        const shape = new Physics.cannon.Plane();
        const body = new Physics.cannon.Body({ mass: 0 }); // Statique
        body.addShape(shape);
        // Cannon.js plane pointe vers Z par défaut, il faut le tourner
        body.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        Physics.world.addBody(body);
    }

    /**
     * Appelé par le TimeManager à chaque frame pour adapter l'éclairage
     * @param {number} angle (0 à 2 PI)
     * @param {number} hour (0 - 24)
     */
    updateTimeOfDay(angle, hour) {
        if (!this.sunLight) return;

        // Calcul positions Soleil/Lune
        const radius = 500;
        this.sunLight.position.x = Math.cos(angle) * radius;
        this.sunLight.position.y = Math.sin(angle) * radius;
        this.sunLight.position.z = Math.cos(angle) * radius * 0.5; // Leger offset Z

        this.moonLight.position.x = -this.sunLight.position.x;
        this.moonLight.position.y = -this.sunLight.position.y;
        this.moonLight.position.z = -this.sunLight.position.z;

        // Intensités basées sur la hauteur
        const sunHeight = Math.max(0, this.sunLight.position.y / radius);
        const moonHeight = Math.max(0, this.moonLight.position.y / radius);

        // Courbe d'intensité lisse (EaseOut)
        let sInt = Math.pow(sunHeight, 0.5) * 3.0;
        let mInt = Math.pow(moonHeight, 0.5) * 0.5;

        // Aube / Crépuscule (Golden Hour)
        let isTwilight = false;
        if ((hour >= 5 && hour <= 7) || (hour >= 18 && hour <= 20)) {
            isTwilight = true;
        }

        // Couleurs
        let sunColor = new THREE.Color(0xffffff);
        let fogColor = new THREE.Color(0x87ceeb); // Jour
        let ambientColor = new THREE.Color(0x404040);

        if (isTwilight) {
            sunColor.setHex(0xff7733); // Orange
            fogColor.setHex(0xffaa88);
            ambientColor.setHex(0x332222);
        } else if (sunHeight === 0) {
            // Nuit
            sunColor.setHex(0x000000);
            fogColor.setHex(0x050a15); // Nuit noire/violette cyberpunk
            ambientColor.setHex(0x0a1128); // Ambiance néon bleue de nuit
        } else {
            // Jour plein
            sunColor.setHex(0xfff5e6);
            fogColor.setHex(0x87ceeb);
            ambientColor.setHex(0x606060);
        }

        // Lisser la transition de couleurs
        this.sunLight.color.lerp(sunColor, 0.05);
        this.scene.fog.color.lerp(fogColor, 0.05);
        this.scene.background.lerp(fogColor, 0.05);
        this.ambientLight.color.lerp(ambientColor, 0.05);

        // Appliquer Intensités
        this.sunLight.intensity = MathUtils.lerp(this.sunLight.intensity, sInt, 0.1);
        this.moonLight.intensity = MathUtils.lerp(this.moonLight.intensity, mInt, 0.1);
    }

    /**
     * Système de Streaming : Vérifie dans quel chunk le joueur se trouve 
     * et charge/décharge les blocs voisins
     * @param {THREE.Vector3} playerPosition 
     */
    updateStreaming(playerPosition) {
        const cx = Math.floor(playerPosition.x / this.chunkSize);
        const cz = Math.floor(playerPosition.z / this.chunkSize);
        const newChunkId = `${cx}_${cz}`;

        if (this.currentChunkId !== newChunkId) {
            this.currentChunkId = newChunkId;
            this._loadChunksAround(cx, cz);
        }
    }

    _loadChunksAround(cx, cz) {
        // Determiner quels chunks doivent être visibles
        const neededChunks = new Set();
        const r = this.renderDistance;

        for (let x = cx - r; x <= cx + r; x++) {
            for (let z = cz - r; z <= cz + r; z++) {
                // Optionnel: Check distance circulaire au lieu d'un carré strict
                if (Math.hypot(x - cx, z - cz) <= r) {
                    neededChunks.add(`${x}_${z}`);
                }
            }
        }

        // Decharger ceux qui ne sont plus needed
        for (const [id, chunkData] of this.chunks.entries()) {
            if (!neededChunks.has(id)) {
                this._unloadChunk(id);
            }
        }

        // Charger les nouveaux
        for (const id of neededChunks) {
            if (!this.chunks.has(id)) {
                const [x, z] = id.split('_').map(Number);
                this._loadChunk(id, x, z);
            }
        }
    }

    _loadChunk(id, cx, cz) {
        // En vrai: fetch HTTP du fichier JSON du chunk (ex: chunk_12_5.json)
        // Ici: Génération procédurale ou mockup en attendant que ProceduralGeneration.js soit fini

        // On reserve la place mémoire pour asynchronicité
        this.chunks.set(id, { loaded: false, group: new THREE.Group(), bodies: [] });

        // On le demande au générateur procédural (via événement ou appel direct)
        // ProceduralGen.generateChunk(cx, cz).then((meshes, physicsBodies) => {...})
    }

    _unloadChunk(id) {
        const chunk = this.chunks.get(id);
        if (!chunk) return;

        // Retirer meshes de la scene
        this.worldGroup.remove(chunk.group);
        // TODO: Libérer mesh/mat materials (dispose) pour ne pas leak RAM

        // Retirer corps physique
        chunk.bodies.forEach(b => Physics.world.removeBody(b));

        this.chunks.delete(id);
    }
}

export const WorldManager = new WorldSystem();
