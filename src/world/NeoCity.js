import * as THREE from 'three';
import { Events } from '../utils/Events.js';
import { Engine } from '../core/Engine.js';
import { ProceduralGenerator } from './ProceduralGeneration.js';
import { WorldManager } from './WorldManager.js';

/**
 * LIFE RPG - Neo City
 * Définit la cartographie globale de la ville. 
 * Orchestrateur de plus haut niveau que WorldManager, il connecte 
 * les "Zones" logiques aux chunks physiques générés.
 */
class CityDirector {
    constructor() {
        this.name = "NeoCity";
        this.mapSize = 10000; // 10km x 10km

        // Mappage des quartiers (Zones). Idéalement, devrait être chargé via JSON.
        this.zones = [
            { id: 'financial', name: 'Financial District', center: { x: 0, z: 0 }, radius: 2000, theme: 'corporate' },
            { id: 'slums', name: 'The Slums', center: { x: 3000, z: -1000 }, radius: 1500, theme: 'dirty' },
            { id: 'suburbs', name: 'North Suburbs', center: { x: 0, z: -4000 }, radius: 2000, theme: 'residential' }
        ];

        this.currentZoneId = null;
    }

    init() {
        // Enregistrer la seed de la ville
        ProceduralGenerator.seed = 2077;

        // Listeners sur le mouvement du joueur pour déclencher les UI de zone
        Events.on('player:moved', (position) => this._checkZone(position));
    }

    /**
     * Détermine dans quel quartier de la ville on se trouve et notifie l'UI/Audio
     */
    _checkZone(position) {
        // Recherche simple par distance
        let closestZone = null;
        let minDistanceSq = Infinity;

        for (const zone of this.zones) {
            const dx = position.x - zone.center.x;
            const dz = position.z - zone.center.z;
            const distSq = dx * dx + dz * dz;

            if (distSq <= zone.radius * zone.radius) {
                if (distSq < minDistanceSq) {
                    minDistanceSq = distSq;
                    closestZone = zone;
                }
            }
        }

        const newZoneId = closestZone ? closestZone.id : 'badlands';
        const newZoneName = closestZone ? closestZone.name : 'The Badlands';

        if (this.currentZoneId !== newZoneId) {
            this.currentZoneId = newZoneId;

            // Emits pour l'UI (ex: MapsApp) et l'Audio (Changement de musique)
            Events.emit('world:zone_entered', newZoneName);

            // Notifie l'UI overlay si besoin (Toast central "Vous entrez dans The Slums")
            Events.emit('ui:show_notification', {
                title: 'LOCATION UPDATE',
                message: `Entering ${newZoneName}`,
                type: 'info'
            });
        }
    }
}

export const NeoCity = new CityDirector();
