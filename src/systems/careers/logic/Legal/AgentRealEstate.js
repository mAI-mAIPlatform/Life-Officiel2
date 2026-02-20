export class AgentRealEstate {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.currentClient = null;
    }

    meetClient(clientEntity, preferenceData) {
        this.currentClient = {
            entity: clientEntity,
            budget: preferenceData.budget,
            desiredZone: preferenceData.desiredZone
        };

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Nouveau client VIP. Il cherche un appartement dans ${preferenceData.desiredZone} pour un budget de ${preferenceData.budget} Crédits. Emmenez-le visiter.`);
        }
    }

    startTour(propertyId) {
        if (!this.currentClient) return;

        // Setup waypoint to property
        console.log(`Starting tour for property ${propertyId}`);
    }

    closeSale(propertyValue) {
        if (!this.currentClient) return;

        const commission = propertyValue * 0.05; // 5% commission
        this.worldManager.playerData.addCredits(commission);
        this.worldManager.executeWorldImpact('housing_market_updated');

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Contrat signé. La commission de ${commission} C a été transférée. Le client est désormais propriétaire.`);
        }

        this.currentClient = null;
    }

    failSale() {
        this.currentClient = null;
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Le client n'a pas été convaincu. Vous feriez mieux de polir vos arguments de vente.");
        }
    }
}
