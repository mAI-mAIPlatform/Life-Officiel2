export class AlleywayDeals {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 480, y: 0, z: 600 },
            max: { x: 500, y: 15, z: 650 }
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
        this.spawnDealer();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Ruelle sombre. C'est le point de chute des marchands d'armes illégales.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnDealer();
    }

    spawnDealer() { }
    despawnDealer() { }

    buyIllegalMods() {
        this.worldManager.executeWorldImpact('wanted_level_increased_hidden');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Achat de mods illégaux confirmé. La matrice de votre arme a été altérée, attention aux scanners de police.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
