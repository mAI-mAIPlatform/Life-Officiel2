export class UndergroundHideout {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: -850, y: -50, z: -850 },
            max: { x: -800, y: 0, z: -800 }
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
        this.spawnBlackMarketNPCs();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Planque souterraine. C'est ici que les Nomades et les Hackers renégats se cachent.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnBlackMarketNPCs();
    }

    spawnBlackMarketNPCs() { }
    despawnBlackMarketNPCs() { }

    rest() {
        this.worldManager.executeWorldImpact('player_health_restored');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Repos terminé. Vos points de vie ont été restaurés hors du réseau de surveillance.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
