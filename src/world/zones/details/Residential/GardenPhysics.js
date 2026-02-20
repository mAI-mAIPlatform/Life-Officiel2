export class GardenPhysics {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: -600, y: 0, z: 200 },
            max: { x: -400, y: 30, z: 400 }
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
        this.setupFoliagePhysics();
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Jardins suspendus. Zone propice à la furtivité ou pour échapper aux drones de sécurité.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.disableFoliagePhysics();
    }

    setupFoliagePhysics() {
        // Enable rustling leaves, wind effects on plants
        console.log("Enabled interactive foliage physics.");
    }

    disableFoliagePhysics() {
        console.log("Disabled interactive foliage physics.");
    }

    interactWithBench() {
        // Sit down logic, recover stamina
        this.worldManager.executeWorldImpact('stamina_recovered');
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
        // calculate wind physics interactions with player movement
    }
}
