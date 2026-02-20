export class TrainYard {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;
        this.trainApproaching = false;

        this.boundingBox = {
            min: { x: -800, y: 0, z: -1200 },
            max: { x: -600, y: 50, z: -1000 }
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
            this.worldManager.ui.triggerMAI("Gare de triage marchandise. Zone très dangereuse, ne restez pas sur les voies.");
        }
    }

    deactivateZone() {
        this.isActive = false;
    }

    triggerTrainArrival() {
        this.trainApproaching = true;
        console.log("A freight train is approaching from sector 7G.");
        // World Event
        this.worldManager.executeWorldImpact('train_pass_rumble');
    }

    hopOnTrain() {
        if (this.trainApproaching) {
            this.worldManager.executeWorldImpact('fast_travel_outskirts');
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Vous avez sauté dans un wagon. Direction la périphérie de NeoCity en toute clandestinité.");
            }
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
