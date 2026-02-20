export class StockExchangeLogic {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 200, y: 0, z: -300 },
            max: { x: 300, y: 100, z: -200 }
        };

        this.marketStatus = "NORMAL"; // CRASH, BOOM
    }

    checkPlayerPresence() {
        // check if player is in bounding box
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

        // mAI Assistance
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Bourse de NeoCity. Analysez les terminaux pour anticiper les fluctuations du marché.");
        }

        this.startTickers();
    }

    deactivateZone() {
        this.isActive = false;
        this.stopTickers();
    }

    startTickers() {
        // visual updates for stock prices
    }

    stopTickers() {
    }

    triggerMarketCrash() {
        // World Impact Logic
        this.marketStatus = "CRASH";
        console.log("MARKET CRASH INITIATED");
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("ALERTE : Krach boursier détecté, les prix de l'immobilier vont chuter.");
        }
        this.worldManager.triggerGlobalEvent("market_crash");
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
