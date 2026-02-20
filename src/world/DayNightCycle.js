import { Events } from '../utils/Events.js';
import { WorldManager } from './WorldManager.js';

/**
 * LIFE RPG - Day Night Cycle
 * Réagit aux événements du TimeManager pour piloter le WorldManager 
 * et déclencher des actions spécifiques à l'heure du jeu (ex: allumer neon).
 */
class CycleManager {
    constructor() {
        this.currentHour = 0;
        this.isNight = false;
    }

    init() {
        Events.on('time:minute_passed', (data) => {
            this.currentHour = data.hours + (data.minutes / 60);

            // Angle du soleil : 6h = 0 rad (Levé), 12h = PI/2, 18h = PI (Couché)
            // (heure - 6) / 24 * 2PI --> pour l'offset, mais on veut map 6h à 0, 18h à PI.
            // Donc (heure - 6) / 12 * PI
            let sunAngle = ((this.currentHour - 6) / 12) * Math.PI;

            // Met à jour WorldManager (Lumières & Fog)
            WorldManager.updateTimeOfDay(sunAngle, this.currentHour);

            // Gérer les flags abstraits
            const wasNight = this.isNight;
            this.isNight = (this.currentHour < 6 || this.currentHour > 18);

            if (this.isNight && !wasNight) {
                Events.emit('world:night_start');
                this._toggleCityLights(true);
            } else if (!this.isNight && wasNight) {
                Events.emit('world:day_start');
                this._toggleCityLights(false);
            }
        });
    }

    _toggleCityLights(turnOn) {
        // Traverser le WorldGroup 3D pour trouver tous les materials émissifs des bâtiments 
        // ou lampadaires, et tween leur composante emissiveIntensity.
        WorldManager.worldGroup.traverse((object) => {
            if (object.isMesh && object.material && object.material.emissive) {
                // Règle arbitraire : Si l'emissive color a une r/g/b != 0
                if (object.material.emissive.getHex() !== 0x000000) {
                    object.material.emissiveIntensity = turnOn ? 1.0 : 0.0;
                    object.material.needsUpdate = true;
                }
            }
        });
    }
}

export const DayNightCycle = new CycleManager();
