export class FactoryScript {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: -800, y: 0, z: -800 },
            max: { x: -600, y: 100, z: -600 }
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
        this.startMachinery();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Complexe industriel lourd. Portez un masque filtrant, les niveaux de toxicité sont élevés ici.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.stopMachinery();
    }

    startMachinery() { }
    stopMachinery() { }

    sabotageProductionLine() {
        this.worldManager.executeWorldImpact('factory_production_halted');
        this.worldManager.triggerGlobalEvent("industrial_accident");

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Ligne de production sabotée. Les prix des composants électroniques dans la ville vont grimper d'ici 24 heures.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
