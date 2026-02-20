export class HelipadAccess {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: -480, y: 260, z: 130 },
            max: { x: -420, y: 280, z: 190 }
        };
    }

    checkPlayerPresence() {
        const p = this.player.position;
        const inZone = p.x >= this.boundingBox.min.x && p.x <= this.boundingBox.max.x &&
            p.y >= this.boundingBox.min.y && p.y <= this.boundingBox.max.y &&
            p.z >= this.boundingBox.min.z && p.z <= this.boundingBox.max.z;

        if (inZone && !this.isActive) {
            this.activateZone();
        } else if (!inZone && this.isActive) {
            this.deactivateZone();
        }
    }

    activateZone() {
        this.isActive = true;
        this.checkHelicopterSpawn();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Héliport. Pour dérober le drone-taxi, vous devrez shunter le système de navigation.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnHelicopter();
    }

    checkHelicopterSpawn() {
        // Only spawn at certain times of day
        console.log("Checking if VIP helicopter should be present.");
    }

    despawnHelicopter() {
    }

    hijackHelicopter(success) {
        if (success) {
            this.worldManager.triggerGlobalEvent("helicopter_stolen");
            this.worldManager.executeWorldImpact('air_patrols_activated');
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Accès autorisé. Prenez les commandes avant que la tour de contrôle ne bloque les rotors.");
            }
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
