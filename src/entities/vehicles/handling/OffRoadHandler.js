/**
 * OffRoadHandler.js
 * 
 * Adjusts suspension stiffness and damping based on the ground surface matrix.
 * Essential for dirt bikes, rally cars, and 4x4s exploring NeoCity's outskirts.
 */

export class OffRoadHandler {
    constructor(vehicleController) {
        this.controller = vehicleController;

        this.surfaceTractionModifier = {
            'asphalt': 1.0,
            'dirt': 0.6,
            'mud': 0.3,
            'grass': 0.7,
            'sand': 0.4
        };

        this.currentSurface = 'asphalt';
    }

    update(deltaTime, raycastResults) {
        if (!this.controller || !raycastResults) return;

        // Check the material the wheels are touching
        let detectedSurface = this.detectSurface(raycastResults);

        if (detectedSurface !== this.currentSurface) {
            this.applySurfaceModifier(detectedSurface);
        }
    }

    detectSurface(raycastData) {
        // Typically read the physics material or metadata of the hit mesh
        // For now, mockup reading 'materialType' from raycast
        let surface = 'asphalt'; // default

        raycastData.forEach(hit => {
            if (hit && hit.body && hit.body.materialType) {
                // If any wheel is in mud/dirt, consider it off-road for those wheels
                // A complete system modifies per-wheel, here we simplify to general material
                surface = hit.body.materialType;
            }
        });

        return surface;
    }

    applySurfaceModifier(surfaceName) {
        this.currentSurface = surfaceName;
        const traction = this.surfaceTractionModifier[surfaceName] || 1.0;

        console.log(`[OffRoadHandler] Surface changed to ${surfaceName}. Modifying traction to ${traction}.`);

        // Apply to all wheels
        for (let i = 0; i < this.controller.wheelInfos.length; i++) {
            // Base friction * traction modifier
            this.controller.wheelInfos[i].frictionSlip = this.controller.baseFriction * traction;
        }

        // Emit event for audio engine to change tire rolling sounds
        dispatchEvent(new CustomEvent('VehicleSurfaceChange', { detail: { surfaceName: surfaceName } }));
    }
}
