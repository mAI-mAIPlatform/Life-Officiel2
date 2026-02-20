export class PortCraneControl {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: -1000, y: 0, z: -1000 },
            max: { x: -800, y: 150, z: -800 }
        };

        this.craneHacked = false;
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
        this.initCraneAnimations();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Terminaux de fret. Des conteneurs d'armes passent par ici. En piratant une grue, vous pourriez extraire une cargaison de contrebande.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.stopCraneAnimations();
    }

    initCraneAnimations() { }
    stopCraneAnimations() { }

    hackCrane(success) {
        if (success) {
            this.craneHacked = true;
            this.worldManager.executeWorldImpact('smuggling_route_opened');
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Grue détournée. Le conteneur 04-X sera déposé en zone morte. Allez le récupérer.");
            }
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
