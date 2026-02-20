export class RangerStation {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 1100, y: 0, z: 1100 },
            max: { x: 1150, y: 20, z: 1150 }
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
            this.worldManager.ui.triggerMAI("Station des Rangers forestiers. L'équipement de survie stocké ici pourrait s'avérer utile.");
        }
    }

    deactivateZone() {
        this.isActive = false;
    }

    stealSupplies() {
        this.worldManager.executeWorldImpact('ranger_pursuit');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Ravitaillement volé. Les Rangers sont désormais à votre recherche dans la zone forestière.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
