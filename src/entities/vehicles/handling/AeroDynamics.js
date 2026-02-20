/**
 * AeroDynamics.js
 * 
 * Calculates drag and downforce for high-speed vehicles.
 * Generates artificial gravity clamping the car to the road to prevent taking off over bumps.
 */

export class AeroDynamics {
    constructor(vehicleController) {
        this.controller = vehicleController;

        // Aero properties
        this.dragCoefficient = 0.30;
        this.frontalArea = 2.2; // roughly 2.2 sqm for a sports car
        this.airDensity = 1.225; // kg/m^3 (sea level)

        this.downforceMultiplier = 1.5; // How much extra gravity is applied per m/s
    }

    update(deltaTime) {
        if (!this.controller || !this.controller.chassisBody) return;

        const velocity = this.controller.chassisBody.velocity;
        const speedSq = velocity.lengthSquared();

        if (speedSq < 0.1) return;

        const speed = Math.sqrt(speedSq);
        const forwardVector = this.controller.getForwardVector();

        // 1. Calculate Drag (Air Resistance) -> F = 0.5 * rho * v^2 * Cd * A
        const dragMagnitude = 0.5 * this.airDensity * speedSq * this.dragCoefficient * this.frontalArea;

        // Apply Drag opposite to velocity
        const dragForce = {
            x: -velocity.x / speed * dragMagnitude,
            y: -velocity.y / speed * dragMagnitude,
            z: -velocity.z / speed * dragMagnitude
        };

        // Apply to center of mass
        this.controller.chassisBody.applyForce(
            new CANNON.Vec3(dragForce.x, dragForce.y, dragForce.z),
            this.controller.chassisBody.position
        );

        // 2. Calculate Downforce (Spoilers/Ground effect)
        // More speed = more force pushing the car down onto its suspension
        const downForceMagnitude = speed * this.downforceMultiplier;
        const downVector = this.controller.getUpVector(); // get local up vector

        this.controller.chassisBody.applyForce(
            new CANNON.Vec3(-downVector.x * downForceMagnitude, -downVector.y * downForceMagnitude, -downVector.z * downForceMagnitude),
            this.controller.chassisBody.position
        );
    }
}
