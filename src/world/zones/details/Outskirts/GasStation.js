export class GasStation {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 800, y: 0, z: 900 },
            max: { x: 850, y: 30, z: 950 }
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
        this.spawnClerk();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Dernière station-service avant les Badlands. Faites le plein, l'essence est rare en dehors de NeoCity.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnClerk();
    }

    spawnClerk() { }
    despawnClerk() { }

    hackPumps() {
        this.worldManager.executeWorldImpact('free_gas_unlocked');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Pompes piratées. Carburant gratuit pour tous vos véhicules... jusqu'à ce que la corpo s'en rende compte.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
