import * as THREE from 'three';
import { NPCBase } from './NPCBase.js';
import { Player } from '../player/Player.js'; // Utilisé plus tard pour la position

/**
 * LIFE RPG - Crowd Manager
 * Optimisation par Object Pooling des PNJ.
 * Ne simule les PNJ qu'autour du joueur (Radius de pop).
 */
class CrowdSystem {
    constructor() {
        this.activeNPCs = []; // Liste des NPCs en cours de simulation
        this.maxPoolSize = 50; // Nombre max d'habitants simulés simultanément

        this.spawnRadius = 100;
        this.despawnRadius = 150;
    }

    init() {
        // Pré-instantiation inutile car on spawn dynamiquement pour l'instant
        // mais l'Object Pooling des meshes Three.js (InstancedMesh) serait l'opti visée.
    }

    update(dt, playerPosition) {
        // 1. Mise à jour de tous les NPCs actifs
        for (let i = this.activeNPCs.length - 1; i >= 0; i--) {
            const npc = this.activeNPCs[i];
            npc.update(dt);

            // 2. Vérifier la distance pour culling / despawn
            const distSq = this._distSq(playerPosition, npc.body.position);
            if (distSq > this.despawnRadius * this.despawnRadius) {
                this._despawnNPC(i);
            }
        }

        // 3. Spawning dynamique si on manque de population
        // On ne le fait pas à chaque frame pour perf, mais disons 10% du temps
        if (Math.random() > 0.9 && this.activeNPCs.length < this.maxPoolSize) {
            this._spawnRandomNPC(playerPosition);
        }
    }

    _spawnRandomNPC(playerPosition) {
        // Spawn sur un cercle aléatoire (SpawnRadius)
        const angle = Math.random() * Math.PI * 2;
        const spawnX = playerPosition.x + Math.cos(angle) * this.spawnRadius;
        const spawnZ = playerPosition.z + Math.sin(angle) * this.spawnRadius;

        // Type de PNJ basé sur des probas rudimentaires
        const rand = Math.random();
        let type = 'civilian';
        if (rand > 0.8) type = 'gang';
        if (rand > 0.9) type = 'police';
        if (rand > 0.95) type = 'corpo';

        const newNpc = new NPCBase(`npc_${Date.now()}_${Math.random()}`, type, new THREE.Vector3(spawnX, 5, spawnZ));
        this.activeNPCs.push(newNpc);
    }

    _despawnNPC(index) {
        const npc = this.activeNPCs[index];
        npc.destroy(); // Retire Mesh et Physique Cannon
        this.activeNPCs.splice(index, 1);
    }

    _distSq(vA, vB) {
        const dx = vA.x - vB.x;
        const dy = vA.y - vB.y;
        const dz = vA.z - vB.z;
        return (dx * dx) + (dy * dy) + (dz * dz);
    }
}

export const CrowdManager = new CrowdSystem();
