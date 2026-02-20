export class AbandonedMine {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 1300, y: -200, z: 1300 },
            max: { x: 1500, y: 50, z: 1500 }
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
        this.activateSpookyAmbiance();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Ancienne mine désaffectée. Pas de réseau GPS ou communicatif ici. Risque d'effondrement : 75%.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.deactivateSpookyAmbiance();
    }

    activateSpookyAmbiance() { }
    deactivateSpookyAmbiance() { }

    triggerCaveIn() {
        this.worldManager.executeWorldImpact('mine_collapsed');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Éboulement imminent, sortez de là !");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
