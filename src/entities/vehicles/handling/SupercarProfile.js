/**
 * SupercarProfile.js
 * 
 * Defines high-performance tuning parameters.
 * Enhances raycast vehicle controllers for extreme speed and handling.
 */

export class SupercarProfile {
    constructor(vehicleController) {
        this.controller = vehicleController;

        this.baseSpecs = {
            engineForce: 8000,
            brakeForce: 250,
            steeringClamp: 0.35,
            mass: 1400, // Very light
            centerOfGravityOffset: { x: 0, y: -0.6, z: 0 }, // Low CG
        };

        this.applyToController();
    }

    applyToController() {
        if (!this.controller || !this.controller.chassisBody) return;

        // Adjust Cannon.js body mass
        this.controller.chassisBody.mass = this.baseSpecs.mass;
        this.controller.chassisBody.updateMassProperties();

        // Lower center of gravity to prevent rolling in tight corners
        // assuming standard cannon.js offset modification via shape offset or similar
        // Just storing specs for the controller to use in its update loop
        this.controller.maxEngineForce = this.baseSpecs.engineForce;
        this.controller.maxBrakeForce = this.baseSpecs.brakeForce;
        this.controller.maxSteeringValue = this.baseSpecs.steeringClamp;
    }

    activateNitro(durationMs) {
        console.log(`[SupercarProfile] NITROUS INJECTED! duration: ${durationMs}ms`);
        const originalEngineForce = this.controller.maxEngineForce;
        this.controller.maxEngineForce = originalEngineForce * 2.5;

        // Visual effects (exhaust flames, FOV warp) handled via event
        dispatchEvent(new CustomEvent('NitroBoost', { detail: { duration: durationMs } }));

        setTimeout(() => {
            this.controller.maxEngineForce = originalEngineForce;
            console.log(`[SupercarProfile] Nitrous depleted.`);
        }, durationMs);
    }
}
