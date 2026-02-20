export class CEO_Office {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 100, y: 180, z: -100 },
            max: { x: 150, y: 200, z: -50 }
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
        this.initOfficeEvents();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Bureau du PDG. Les terminaux ici contiennent des données hautement confidentielles. Chaque action ici a un impact mondial.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.clearEvents();
    }

    initOfficeEvents() {
        // ...
    }

    clearEvents() {
        // ...
    }

    stealCorporateData() {
        this.worldManager.triggerGlobalEvent("corporate_data_leak");
        this.worldManager.executeWorldImpact("corp_stock_plummet");
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Données téléchargées. Le cours de l'action mServices va s'effondrer.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
