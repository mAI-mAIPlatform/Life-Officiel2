export class HackerTerminal {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.softwareLevel = 1;
        this.activeTrace = 0; // 0 to 100%
        this.isHacking = false;
    }

    startHack(targetSystem) {
        this.isHacking = true;
        this.activeTrace = 0;

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Initialisation du protocole d'intrusion. Connexion au noeud sécurisé de ${targetSystem}. Ice détecté.`);
        }
    }

    progressHack(speed) {
        if (!this.isHacking) return;

        // Simulating the minigame progress and ICE trace
        this.activeTrace += (speed * 0.5) / this.softwareLevel;

        if (this.activeTrace >= 100) {
            this.failHack();
        }
    }

    upgradeSoftware() {
        this.softwareLevel++;
        console.log(`Cyberdeck software upgraded to level ${this.softwareLevel}`);
    }

    finishHack(stolenDataValue) {
        this.isHacking = false;
        this.worldManager.playerData.addCredits(stolenDataValue);

        // World Impact
        this.worldManager.executeWorldImpact('data_breach_public');
        this.worldManager.triggerGlobalEvent("corporate_stock_drop", { severity: 2 });

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Firewall brisé. Payload livré. Les Crédits indétectables sont sur votre compte crypté.");
        }
    }

    failHack() {
        this.isHacking = false;
        this.worldManager.playerData.increaseWantedLevel(4);
        this.worldManager.executeWorldImpact('player_location_traced');

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Alerte: Trace de NetRunner complétée. Votre position IP physique est compromise, fuyez !");
        }
    }
}
