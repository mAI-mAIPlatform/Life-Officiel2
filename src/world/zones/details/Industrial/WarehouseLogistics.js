export class WarehouseLogistics {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;
        this.stockpileLevel = 100;

        this.boundingBox = {
            min: { x: -700, y: 0, z: -900 },
            max: { x: -600, y: 50, z: -800 }
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

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Hangar de fret. Les inventaires de mServices transitent ici. Des palettes entières disparaissent parfois...");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnWorkers();
    }

    spawnWorkers() { }
    despawnWorkers() { }

    stealInventory() {
        if (this.stockpileLevel > 0) {
            this.stockpileLevel -= 20;
            this.worldManager.executeWorldImpact('black_market_supply_up');

            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Vol réussi. Les marchandises ont été redirigées vers votre planque.");
            }
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
