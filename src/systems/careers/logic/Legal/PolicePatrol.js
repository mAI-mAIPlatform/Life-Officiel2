export class PolicePatrol {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;
        this.shiftStarted = false;
        this.arrestsMade = 0;
    }

    startShift() {
        this.shiftStarted = true;
        this.worldManager.executeWorldImpact('police_presence_increased');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Prise de service confirmée, Officier. Canaux de la NCPD synchronisés. En attente de signalement de crimes.");
        }
    }

    endShift() {
        this.shiftStarted = false;
        console.log(`Shift ended. Arrests made: ${this.arrestsMade}`);
        // Calculate paycheck
        const pay = this.arrestsMade * 500;
        this.worldManager.playerData.addCredits(pay);
    }

    receiveDispatch(crimeData) {
        if (!this.shiftStarted) return;

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Code 10-31 en cours : ${crimeData.type} à ${crimeData.location}. Intervenez immédiatement.`);
        }
        // Add waypoint to UI
    }

    makeArrest(targetEntity) {
        if (!this.shiftStarted) return;
        this.arrestsMade++;
        targetEntity.setArrested();
        this.worldManager.executeWorldImpact('street_crime_reduced');

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Suspect appréhendé. Prime de capture ajoutée à la paie de fin de service.");
        }
    }

    update() {
        if (!this.shiftStarted) return;
        // Check for nearby crimes in progress
    }
}
