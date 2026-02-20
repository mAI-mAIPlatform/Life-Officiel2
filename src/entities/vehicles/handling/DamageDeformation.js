/**
 * DamageDeformation.js
 * 
 * Connects high-velocity impacts to morph targets or vertex manipulation on the vehicle mesh.
 * Also downgrades vehicle performance when heavily damaged.
 */

export class DamageDeformation {
    constructor(vehicleController, visualMesh) {
        this.controller = vehicleController;
        this.mesh = visualMesh;

        this.health = 100;
        this.isTotaled = false;

        // Listen to cannon.js collision events
        if (this.controller.chassisBody) {
            this.controller.chassisBody.addEventListener('collide', this.handleCollision.bind(this));
        }
    }

    handleCollision(event) {
        if (this.isTotaled) return;

        // Calculate impact velocity
        const relativeVelocity = event.contact.getImpactVelocityAlongNormal();
        const force = Math.abs(relativeVelocity);

        // Ignore small bumps
        if (force < 5.0) return;

        // Damage depends on force
        const damageAmount = force * 2.5;
        this.applyDamage(damageAmount, event.contact.ri);
    }

    applyDamage(amount, localPointOfImpact) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;

        console.log(`[DamageDeformation] Impact! Took ${amount.toFixed(1)} damage. Health: ${this.health.toFixed(1)}`);

        this.deformMesh(amount, localPointOfImpact);
        this.degradePerformance();

        if (this.health === 0) {
            this.totalVehicle();
        }
    }

    deformMesh(forceAmount, point) {
        // In Three.js, you might send this to a vertex shader, morph target, 
        // or iterate through closest vertices within a radius and offset them inwards
        // based on the normal of the impact.

        // Trigger particle sparks, smoke, glass shatter
        dispatchEvent(new CustomEvent('VehicleDamageFX', {
            detail: { intensity: forceAmount, offset: point }
        }));
    }

    degradePerformance() {
        // E.g., at < 50% health, reduce max engine force and add steering pull
        if (this.health < 50) {
            this.controller.maxEngineForce *= 0.8; // Lose 20% power
            this.controller.steeringPullFactor = 0.05; // Car pulls to side
        }
    }

    totalVehicle() {
        this.isTotaled = true;
        this.controller.maxEngineForce = 0;
        console.log(`[DamageDeformation] Vehicle Totaled.`);
        // Emit explosion/fire event
    }
}
