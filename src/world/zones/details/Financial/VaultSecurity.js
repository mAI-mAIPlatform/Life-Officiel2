export class VaultSecurity {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;
        this.securityLevel = 5; // max

        this.boundingBox = {
            min: { x: 120, y: -50, z: -170 },
            max: { x: 140, y: 0, z: -150 }
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
            this.worldManager.ui.triggerMAI("Vous entrez dans la zone du coffre-fort. Capteurs de mouvement actifs.");
        }
        this.initLasers();
    }

    deactivateZone() {
        this.isActive = false;
        this.disableLasers();
    }

    initLasers() {
        // spawn laser traps
    }

    disableLasers() {
        // remove lasers to save performance
    }

    hackSystem(success) {
        // World Impact
        if (success) {
            this.securityLevel = 0;
            this.worldManager.triggerGlobalEvent("bank_hacked");
            // e.g., turn off lights in financial district
            this.worldManager.executeWorldImpact('financial_lights_out');
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Piratage réussi. Systèmes d'alarme hors ligne, mais la police est en route.");
            }
        } else {
            this.worldManager.triggerGlobalEvent("bank_alarm");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
