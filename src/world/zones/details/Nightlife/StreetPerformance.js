export class StreetPerformance {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 500, y: 0, z: 400 },
            max: { x: 650, y: 20, z: 450 }
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
        this.spawnCrowd();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Performance de rue. Profitez de la foule dense pour échapper à vos poursuivants si nécessaire.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnCrowd();
    }

    spawnCrowd() { }
    despawnCrowd() { }

    tossCoin() {
        this.worldManager.executeWorldImpact('street_rep_increased');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Don généreux. Votre réputation auprès des habitants locaux a légèrement augmenté.");
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
