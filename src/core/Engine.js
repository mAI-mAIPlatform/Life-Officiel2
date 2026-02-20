import * as THREE from 'three';
import { EngineConfig } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';
import { Events } from '../utils/Events.js';

/**
 * LIFE RPG - Moteur 3D Principal
 * Gère l'initialisation de Three.js, le renderer, la scène principale,
 * la caméra, les écouteurs de redimensionnement et les optimisations graphiques.
 */
class Engine3D {
    constructor() {
        this.container = null;
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.clock = new THREE.Clock();

        // Post-Processing
        this.composer = null;

        // Optimisations
        this.frustum = new THREE.Frustum();
        this.cameraViewProjectionMatrix = new THREE.Matrix4();

        this.isInitialized = false;
        this.resizeObserver = null;
    }

    /**
     * Initialise le moteur 3D sur le canvas donné
     * @param {string} containerId ID de l'élément div HTML container
     */
    init(containerId = 'game-canvas-container') {
        if (this.isInitialized) {
            Logger.warn('Engine', 'Le moteur est déjà initialisé.');
            return;
        }

        try {
            Logger.info('Engine', 'Initialisation du Moteur 3D (Three.js)...');

            this.container = document.getElementById(containerId);
            if (!this.container) {
                throw new Error(`Container WebGL introuvable : #${containerId}`);
            }

            this._setupRenderer();
            this._setupScene();
            this._setupCamera();
            this._setupResizeHandlers();

            // Émet un événement global
            Events.emit('engine:initialized', {
                renderer: this.renderer,
                scene: this.scene,
                camera: this.camera
            });

            this.isInitialized = true;
            Logger.info('Engine', 'Moteur 3D initialisé avec succès !');

        } catch (error) {
            Logger.fatal('Engine', 'Erreur critique lors de l\'initialisation du WebGL Renderer', error);
        }
    }

    /**
     * Configuration ultra-moderne du renderer WebGL2
     */
    _setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: EngineConfig.RENDERER.ANTIALIAS,
            powerPreference: EngineConfig.RENDERER.POWER_PREFERENCE,
            precision: EngineConfig.RENDERER.PRECISION,
            logarithmicDepthBuffer: EngineConfig.RENDERER.LOGARITHMIC_DEPTH_BUFFER,
            alpha: false, // On ne dessine pas en transparent sur la page HTML
            stencil: false // Désactivé si on n'en a pas besoin pour grapiller de la perf
        });

        // Dimensions
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(EngineConfig.RENDERER.PIXEL_RATIO);

        // Couleurs physiquement correctes et Tone Mapping ACES Filmic (Cinématique)
        this.renderer.physicallyCorrectLights = EngineConfig.RENDERER.PHYSICALLY_CORRECT_LIGHTS;
        this.renderer.toneMapping = EngineConfig.RENDERER.TONE_MAPPING; // ACESFilmic
        this.renderer.toneMappingExposure = EngineConfig.RENDERER.TONE_MAPPING_EXPOSURE;

        // Configuration Globale des Ombres
        if (EngineConfig.RENDERER.ENABLE_SHADOWS) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = EngineConfig.RENDERER.SHADOW_MAP_TYPE;
            this.renderer.shadowMap.autoUpdate = true;
            // Optimisation: false par défaut si on gère la maj des ombres manuellement
            // this.renderer.shadowMap.needsUpdate = true;
        }

        // Ajout au DOM
        this.container.appendChild(this.renderer.domElement);

        // Empêche le clic droit natif sur le canvas
        this.renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
    }

    /**
     * Crée la scène principale 3D
     */
    _setupScene() {
        this.scene = new THREE.Scene();
        // Background par défaut (Ciel nocturne cyberpunk)
        this.scene.background = new THREE.Color(0x0a0a0c);

        // Ajout d'un système de brouillard basique (peut être surclassé par WeatherSystem)
        this.scene.fog = new THREE.FogExp2(0x0a0a0c, 0.002);
    }

    /**
     * Prépare la Caméra Perspective Principale
     */
    _setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            EngineConfig.CAMERA.FOV,
            aspect,
            EngineConfig.CAMERA.NEAR_CLIP,
            EngineConfig.CAMERA.FAR_CLIP
        );

        // Position Initiale Débug
        const defPos = EngineConfig.CAMERA.DEFAULT_POSITION;
        this.camera.position.set(defPos[0], defPos[1], defPos[2]);
        this.camera.lookAt(new THREE.Vector3(...EngineConfig.CAMERA.DEFAULT_TARGET));
    }

    /**
     * Gère dynamiquement le redimensionnement de l'écran ou de la fenêtre
     */
    _setupResizeHandlers() {
        // Au lieu du 'resize' event, ResizeObserver est beaucoup plus performant
        // et prend en charge le canvas lui-même s'il est redimensionné via CSS flex etc.
        this.resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === this.container) {
                    this._onWindowResize(entry.contentRect.width, entry.contentRect.height);
                }
            }
        });
        this.resizeObserver.observe(this.container);

        // Fallback d'urgence pour la rotation mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this._onWindowResize(window.innerWidth, window.innerHeight), 100);
        });
    }

    _onWindowResize(width, height) {
        if (!this.camera || !this.renderer) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);

        if (this.composer) {
            this.composer.setSize(width, height);
        }

        Logger.debug('Engine', `Redimensionnement: ${width}x${height}`);
        Events.emit('engine:resize', { width, height });
    }

    /**
     * Met à jour Frustum Culling manuellement (pour vérifier la visibilité d'objets ou NPCs)
     */
    updateFrustum() {
        this.camera.updateMatrixWorld();
        this.cameraViewProjectionMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
        this.frustum.setFromProjectionMatrix(this.cameraViewProjectionMatrix);
    }

    /**
     * Rendu de la scène à chaque frame
     */
    render() {
        if (!this.isInitialized || !this.renderer || !this.scene || !this.camera) return;

        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Helper pour forcer le resize manuellement depuis main.js
     */
    resize() {
        this._onWindowResize(window.innerWidth, window.innerHeight);
    }

    /**
     * Nettoyage manuel total (Memory Management)
     */
    dispose() {
        Logger.info('Engine', 'Fermeture et Nettoyage du Moteur 3D...');
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }

        if (this.renderer) {
            this.container.removeChild(this.renderer.domElement);
            this.renderer.dispose();
            this.renderer.forceContextLoss();
        }

        // On libère la scène (ne libère pas les textures, c'est le ResourceManager qui doit le faire)
        this.scene.clear();
        this.isInitialized = false;

        Events.emit('engine:disposed');
    }
}

// Export en singleton
export const Engine = new Engine3D();
