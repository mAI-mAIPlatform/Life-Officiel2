export class PenthouseLogic {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: -500, y: 200, z: 100 },
            max: { x: -400, y: 250, z: 200 }
        };

        this.owner = "Corpo Exec";
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
        this.loadInteriorFurniture();
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Penthouse privé. Attention, ces propriétés sont hautement surveillées et reliées à la domotique de NeoCity.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.unloadInteriorFurniture();
    }

    loadInteriorFurniture() {
    }

    unloadInteriorFurniture() {
    }

    hackSafe() {
        this.worldManager.executeWorldImpact('penthouse_robbed');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Coffre piraté avec succès. Les fonds ont été transférés sur votre compte off-shore.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
