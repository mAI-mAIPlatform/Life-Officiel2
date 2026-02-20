export class TradingFloor {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 210, y: 10, z: -280 },
            max: { x: 290, y: 30, z: -220 }
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
        this.spawnTraders();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Plateforme de trading. Vous pouvez interagir avec les terminaux pour manipuler les cours, mais attention à la SEC de NeoCity.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.cleanUp();
    }

    spawnTraders() {
        // High density NPCs
    }

    cleanUp() {
    }

    manipulateStock(stockId, action) {
        // World impact logic
        this.worldManager.executeWorldImpact(`stock_manipulated_${stockId}`);
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Manipulation réussie. Le cours de ${stockId} est en train de ${action}.`);
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
