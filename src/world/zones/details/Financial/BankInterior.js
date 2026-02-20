export class BankInterior {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        // Bounding Box Check: Financial District Bank
        this.boundingBox = {
            min: { x: 100, y: 0, z: -200 },
            max: { x: 150, y: 50, z: -150 }
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
        console.log("Bank Interior Active");

        // mAI Assistance
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Bienvenue à la Banque Centrale. Restez discret si vous cherchez les coffres, la sécurité est maximale.");
        }

        // Logic specific to the bank
        this.spawnTellers();
        this.initAtm();
    }

    deactivateZone() {
        this.isActive = false;
        console.log("Bank Interior Deactivated");
        this.cleanUpEntities();
    }

    spawnTellers() {
        // ... Logic for spawning bank tellers ...
    }

    initAtm() {
        // ... Interactive ATMs ...
    }

    cleanUpEntities() {
        // Destroy entities when player leaves bounding box
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
        // Update loop logic ...
    }
}
