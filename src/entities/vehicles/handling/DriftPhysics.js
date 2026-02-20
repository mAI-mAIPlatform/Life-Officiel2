/**
 * DriftPhysics.js
 * 
 * Intercepts normal vehicle input and tyre friction.
 * Calculates side-slip angles and dynamically adjusts rear tyre adhesion to allow for drifting.
 */

export class DriftPhysics {
    constructor(vehicleController) {
        this.controller = vehicleController;

        this.isDrifting = false;
        this.driftScore = 0;

        this.normalFriction = 10.5;
        this.driftFriction = 3.0; // Reduced grip
        this.angleThreshold = 0.4; // Radians of slip to consider it a drift
    }

    update(deltaTime, playerInput) {
        if (!this.controller) return;

        // Check if handbrake is pulled or if slip angle is high
        const speed = this.controller.getCurrentSpeedKmHour();
        const steering = playerInput.steering;
        const handbrake = playerInput.handbrake;

        // Simplified slip angle calculation (normally dot product of velocity and forward vector)
        const lateralVelocityMag = Math.abs(this.controller.getLateralVelocity());

        if (speed > 40 && (handbrake || lateralVelocityMag > 5.0)) {
            this.initiateDrift();
        } else if (lateralVelocityMag < 2.0 && !handbrake) {
            this.recoverGrip();
        }

        if (this.isDrifting) {
            this.accumulateScore(deltaTime, speed, lateralVelocityMag);
        }
    }

    initiateDrift() {
        if (this.isDrifting) return;
        this.isDrifting = true;
        this.driftScore = 0;

        // Lower friction on rear wheels (assuming index 2 and 3 are rear)
        for (let i = 2; i < 4; i++) {
            this.controller.wheelInfos[i].frictionSlip = this.driftFriction;
        }

        // Spawn smoke particles
        dispatchEvent(new CustomEvent('DriftStart', { detail: { vehicle: this.controller } }));
    }

    recoverGrip() {
        if (!this.isDrifting) return;
        this.isDrifting = false;

        // Restore friction
        for (let i = 2; i < 4; i++) {
            this.controller.wheelInfos[i].frictionSlip = this.normalFriction;
        }

        dispatchEvent(new CustomEvent('DriftEnd', { detail: { score: Math.round(this.driftScore) } }));
    }

    accumulateScore(deltaTime, speed, angle) {
        // More speed and angle = faster score gain
        const frameScore = (speed * 0.1) * (angle * 0.5) * deltaTime;
        this.driftScore += frameScore;
        // Broadcast for UI updates
        dispatchEvent(new CustomEvent('DriftUpdate', { detail: { score: Math.round(this.driftScore) } }));
    }
}
