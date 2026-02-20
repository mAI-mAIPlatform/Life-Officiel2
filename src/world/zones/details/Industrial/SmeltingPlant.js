export class SmeltingPlant {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;
        this.heatLevel = 0;

        this.boundingBox = {
            min: { x: -950, y: 0, z: -700 },
            max: { x: -850, y: 120, z: -600 }
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
        this.startFurnaces();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Fonderie. Température ambiante de 55 degrés. L'exposition prolongée va drainer votre endurance.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.stopFurnaces();
    }

    startFurnaces() {
        this.heatLevel = 100;
        console.log("Furnaces roaring.");
    }

    stopFurnaces() {
        this.heatLevel = 0;
    }

    disposeEvidence() {
        this.worldManager.executeWorldImpact('evidence_destroyed');
        this.worldManager.triggerGlobalEvent("wanted_level_reduced", { amount: 2 });
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Preuves incinérées. Les dossiers de la NCPD à votre sujet viennent de perdre un élément clé.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;

        // Heat stamina drain logic over time...
    }
}
