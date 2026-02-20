export class PoolAreaLogic {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: -450, y: 190, z: 120 },
            max: { x: -420, y: 210, z: 150 }
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
        this.initWaterPhysics();
        this.spawnPoolNPCs();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Piscine à débordement. Vos mouvements seront ralentis dans l'eau. Idéal pour espionner la terrasse adjacente.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.disableWaterPhysics();
        this.despawnPoolNPCs();
    }

    initWaterPhysics() {
        console.log("Water ripples and drag enabled.");
    }

    disableWaterPhysics() {
    }

    spawnPoolNPCs() {
    }

    despawnPoolNPCs() {
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
