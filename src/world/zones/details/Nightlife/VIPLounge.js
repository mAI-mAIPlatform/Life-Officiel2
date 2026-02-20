export class VIPLounge {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 500, y: 50, z: 500 },
            max: { x: 550, y: 80, z: 550 }
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
        this.spawnVIPs();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Accès VIP. Assurez-vous d'avoir l'accréditation ou un déguisement adéquat, ou les gardes vous abattront à vue.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnVIPs();
    }

    spawnVIPs() { }
    despawnVIPs() { }

    eavesdropConversation() {
        this.worldManager.executeWorldImpact('corporate_secrets_uncovered');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Enregistrement audio stocké. Ces informations de chantage se revendront cher sur le marché noir.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
