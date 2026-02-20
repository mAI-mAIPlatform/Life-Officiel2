export class DirtRoadPhysics {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 1000, y: 0, z: 800 },
            max: { x: 1200, y: 50, z: 1200 }
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
        this.enableSlipPhysics();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Routes non goudronnées. Les pneus lisses des véhicules de ville perdront leur adhérence ici. Prudence.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.disableSlipPhysics();
    }

    enableSlipPhysics() {
        // adjust vehicle friction logic
    }

    disableSlipPhysics() { }

    triggerMudSlide() {
        this.worldManager.executeWorldImpact('road_blocked');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Avertissement météo: Coulée de boue détectée. L'accès Est est temporairement bloqué.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
