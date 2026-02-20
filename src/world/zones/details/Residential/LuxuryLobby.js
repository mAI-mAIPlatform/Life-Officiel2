export class LuxuryLobby {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: -500, y: 0, z: 100 },
            max: { x: -400, y: 50, z: 200 }
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
        this.spawnConcierge();
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Hall du complexe résidentiel. Le concierge a des informations sur les locataires des penthouses, utile si vous cherchez quelqu'un.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnConcierge();
    }

    spawnConcierge() {
        // Spawn concierge NPC
    }

    despawnConcierge() {
    }

    interactWithConcierge() {
        // Dialogue with the concierge
        this.worldManager.executeWorldImpact('concierge_bribed');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Informations obtenues. Vous avez maintenant les codes d'accès VIP pour les ascenseurs.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
