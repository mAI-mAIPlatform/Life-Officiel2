export class TrailerPark {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 900, y: 0, z: 950 },
            max: { x: 1000, y: 30, z: 1050 }
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
        this.spawnLocals();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Parc de mobile homes. Les habitants ici vivent en marge du système. Excellente zone pour se faire oublier de la NCPD.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnLocals();
    }

    spawnLocals() { }
    despawnLocals() { }

    buyInformation() {
        this.worldManager.executeWorldImpact('outskirt_map_revealed');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Données téléchargées. La carte topographique de la périphérie a été mise à jour avec les caches secrètes.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
