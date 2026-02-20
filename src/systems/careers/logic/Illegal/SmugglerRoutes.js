export class SmugglerRoutes {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.activeRoute = null;
        this.contrabandWeight = 0;
    }

    acceptContract(contractData) {
        this.activeRoute = contractData; // e.g., destination, risk level, reward
        this.contrabandWeight = contractData.weight;

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Nouveau run de contrebande accepté. Livrez ${this.contrabandWeight}kg de matériel militaire à ${contractData.destination}. Évitez les scanners de douane.`);
        }
    }

    encounterPoliceCheck() {
        if (!this.activeRoute) return;

        // the higher the weight, the harder to hide
        const detectionChance = this.contrabandWeight * 0.05 * this.activeRoute.risk;

        if (Math.random() < detectionChance) {
            this.failRun();
        } else {
            console.log("Successfully passed police checkpoint.");
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Faux manifeste accepté par le drone douanier. Continuez votre route.");
            }
        }
    }

    completeRun() {
        if (!this.activeRoute) return;

        this.worldManager.playerData.addCredits(this.activeRoute.reward);
        this.worldManager.executeWorldImpact('smuggling_successful');

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Cargaison livrée au client. Prime de ${this.activeRoute.reward}C reçue. Un job propre.`);
        }

        this.activeRoute = null;
        this.contrabandWeight = 0;
    }

    failRun() {
        this.activeRoute = null;
        this.contrabandWeight = 0;
        this.worldManager.playerData.increaseWantedLevel(3);

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Alerte Rouge : Contrebande détectée par les scanners de la Corpo-Police! Lâchez le colis et perdez-vous dans les ruelle!");
        }
    }
}
