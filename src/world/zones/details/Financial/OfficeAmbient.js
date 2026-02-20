export class OfficeAmbient {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 50, y: 0, z: -250 },
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
        this.spawnWorkers();
        this.playOfficeSounds();
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Zone d'affaires. Soyez en costume si vous souhaitez accéder aux étages supérieurs sans attirer l'attention.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.stopOfficeSounds();
        this.despawnWorkers();
    }

    spawnWorkers() {
        // Ambient workers walking around
    }

    despawnWorkers() {
    }

    playOfficeSounds() {
    }

    stopOfficeSounds() {
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
