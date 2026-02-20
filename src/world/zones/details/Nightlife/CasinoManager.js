export class CasinoManager {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 650, y: 0, z: 450 },
            max: { x: 750, y: 100, z: 550 }
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
        this.playCasinoAmbiance();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Le Grand Casino de NeoCity. Vous pouvez blanchir vos crédits ici, mais la sécurité de la Triade surveille.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.stopCasinoAmbiance();
    }

    playCasinoAmbiance() { }
    stopCasinoAmbiance() { }

    playRoulette(betAmount, selection) {
        // Simulate roulette
        const result = Math.floor(Math.random() * 37);
        // ... determine win/loss ...

        if (betAmount > 100000) {
            this.worldManager.executeWorldImpact('high_roller_alert');
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Mise exceptionnellement haute détectée. La direction garde un œil sur vous.");
            }
        }
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
