export class CampfireLogic {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;
        this.fireLit = false;

        this.boundingBox = {
            min: { x: 1000, y: 0, z: 1000 },
            max: { x: 1020, y: 20, z: 1020 }
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

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Vous avez découvert un ancien feu de camp. Un moment de répit loin du bruit de NeoCity.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        if (this.fireLit) {
            this.extinguishFire();
        }
    }

    lightFire() {
        this.fireLit = true;
        console.log("Campfire lit.");
        this.worldManager.executeWorldImpact('cold_resistance_up');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Feu allumé. Vos paramètres vitaux vont se stabiliser.");
        }
    }

    extinguishFire() {
        this.fireLit = false;
        console.log("Campfire extinguished.");
    }

    rest() {
        if (this.fireLit) {
            this.worldManager.executeWorldImpact('player_full_heal_outskirts');
            this.worldManager.advanceTime(8); // skip 8 hours
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
