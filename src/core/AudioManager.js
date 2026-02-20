import * as THREE from 'three';
import { Engine } from './Engine.js';
import { CameraSystem } from './CameraManager.js';
import { AudioConfig } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';
import { AudioRegistry } from '../data/assets/audio_registry.js';
import { AssetLoader } from './AssetLoader.js';

/**
 * LIFE RPG - Audio Manager
 * Gère l'API Web Audio via THREE.AudioListener, implémente la spatialisation (son 3D),
 * les pools d'effets sonores (SFX), la musique dynamique (BGM) et l'UI.
 */
class AudioEngine {
    constructor() {
        this.listener = null;

        // Pools & Players
        this.bgmPlayer = null;
        this.sfxPoolLength = 20; // Nombre max simultané par grosse réserve
        this.sfxPool3D = [];
        this.sfxPool2D = [];

        this.isMuted = false;
        this.masterVolume = AudioConfig.MASTER_VOLUME;
        this.isInitialized = false;

        // Caches pour AudioBuffers
        this.buffers = new Map();
    }

    init() {
        if (this.isInitialized) return;

        // L'AudioListener (Les "oreilles" du joueur) doit être attaché à la Caméra
        this.listener = new THREE.AudioListener();

        // Fallback sécurité si l'Engine n'a pas encore de cam (ne devrait pas arriver avec la bonne architecture)
        if (Engine.camera) {
            Engine.camera.add(this.listener);
        }

        // Création des pistes Globales
        this.listener.setMasterVolume(this.masterVolume);

        // Instanciation Piscine 2D (UI, Menus, Narrateur)
        for (let i = 0; i < 5; i++) {
            this.sfxPool2D.push(new THREE.Audio(this.listener));
        }

        // Instanciation Piscine 3D (Tirs, Bruits de pas, Voitures)
        for (let i = 0; i < this.sfxPoolLength; i++) {
            const sound3D = new THREE.PositionalAudio(this.listener);
            sound3D.setRefDistance(AudioConfig.SPATIALIZATION.REF_DISTANCE);
            sound3D.setMaxDistance(AudioConfig.SPATIALIZATION.MAX_DISTANCE);
            sound3D.setRolloffFactor(AudioConfig.SPATIALIZATION.ROLLOFF_FACTOR);
            // Utilisera le modèle Linear pour que le son s'atténue réalistiquement
            sound3D.setDistanceModel('linear');

            this.sfxPool3D.push(sound3D);
        }

        // Player de Musique
        this.bgmPlayer = new THREE.Audio(this.listener);
        this.bgmPlayer.setLoop(true);

        this.isInitialized = true;
        Logger.info('Audio', 'Moteur Audio Spatialisé initialisé.');
    }

    /**
     * Attache l'oreille a un objet spécifique (Si la caméra bouge bizarrement, parfois l'oreille doit être sur la tête du Model)
     */
    attachListenerTo(object3d) {
        if (!this.listener) return;

        // Detach previous
        if (this.listener.parent) {
            this.listener.parent.remove(this.listener);
        }

        object3d.add(this.listener);
    }

    /**
     * Joue un son UI ou global sans positionnement
     * @param {AudioBuffer} buffer 
     * @param {number} volume 
     */
    play2D(buffer, volume = AudioConfig.SFX_VOLUME) {
        if (!this.isInitialized || this.isMuted || !buffer) return;

        // Trouver une source 2D libre
        const source = this.sfxPool2D.find(s => !s.isPlaying);
        if (source) {
            source.setBuffer(buffer);
            source.setVolume(volume);
            source.play();
        } else {
            // Logger.warn('Audio', 'Plus de pistes 2D disponibles (Limité à 5)');
        }
    }

    /**
     * Joue un son spatialisé à un endroit du monde
     * @param {AudioBuffer} buffer 
     * @param {THREE.Vector3} position 
     * @param {number} volume 
     */
    play3DAtPosition(buffer, position, volume = AudioConfig.SFX_VOLUME) {
        if (!this.isInitialized || this.isMuted || !buffer) return;

        // Trouver une source 3D libre
        const source = this.sfxPool3D.find(s => !s.isPlaying);

        if (source) {
            // Les PositionalAudio dans ThreeJS doivent exister dans le scene-graph pour émettre depuis un lieu
            // Si le son est "tiré n'importe où", on l'ajoute temporairement à la scene, à l'endroit voulu
            source.position.copy(position);

            if (!source.parent) {
                Engine.scene.add(source);
            }

            source.setBuffer(buffer);
            source.setVolume(volume);
            source.play();
        } else {
            // Pool saturée, dans un jeu de tir on vole le plus vieux son généralement.
        }
    }

    /**
     * Attache une source audio 3D DYNAMIQUE à un mesh (Ex: Moteur de voiture)
     * Pour ça on retourne la source au lieu de gérer en tire-et-oublie.
     */
    createAttached3D(buffer, meshObject, options = { loop: true }) {
        const sound3D = new THREE.PositionalAudio(this.listener);
        sound3D.setRefDistance(AudioConfig.SPATIALIZATION.REF_DISTANCE);
        sound3D.setMaxDistance(AudioConfig.SPATIALIZATION.MAX_DISTANCE);
        meshObject.add(sound3D);

        if (buffer) sound3D.setBuffer(buffer);
        sound3D.setLoop(options.loop);

        return sound3D;
        // Penser à sound3D.parent.remove(sound3D) lors de la destruction !!!
    }

    /**
     * Joue une musique ambiante / Radio in-game
     */
    playBGM(buffer, fadeDuration = 1.0) {
        if (!this.isInitialized || !buffer) return;

        if (this.bgmPlayer.isPlaying) {
            // Crossfade rudimentaire ou stop pur
            this.bgmPlayer.stop();
        }

        this.bgmPlayer.setBuffer(buffer);
        this.bgmPlayer.setVolume(AudioConfig.MUSIC_VOLUME);
        this.bgmPlayer.play();
        // TODO: Implémenter le gainNode fade-in
    }

    /**
     * Joue un son directement depuis son ID dans le registre
     */
    async playFromRegistry(id, position = null) {
        // Chercher l'item dans le registre
        let item = null;
        for (const category of Object.values(AudioRegistry)) {
            const found = category.find(x => x.id === id);
            if (found) { item = found; break; }
        }

        if (!item) {
            Logger.error('Audio', `ID Audio introuvable dans le registre: ${id}`);
            return;
        }

        try {
            const buffer = await AssetLoader.loadAudio(item.path);
            if (item.is3D && position) {
                this.play3DAtPosition(buffer, position, item.baseVolume);
            } else if (item.id.startsWith('radio_') || item.id.startsWith('amb_')) {
                this.playBGM(buffer, 1.0);
            } else {
                this.play2D(buffer, item.baseVolume);
            }
        } catch (e) {
            Logger.error('Audio', `Impossible de jouer l'audio du registre ${id} : dummy file expected to fail WebAudio decode.`);
        }
    }

    setMasterVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.listener) {
            this.listener.setMasterVolume(this.masterVolume);
        }
    }
}

export const AudioSys = new AudioEngine();
