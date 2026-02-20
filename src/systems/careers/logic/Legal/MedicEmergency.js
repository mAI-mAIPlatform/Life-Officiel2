export class MedicEmergency {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.shiftStarted = false;
        this.patientsSaved = 0;
    }

    startShift() {
        this.shiftStarted = true;
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Unité Trauma Team activée. Tenez-vous prêt, NeoCity ne dort jamais.");
        }
    }

    endShift() {
        this.shiftStarted = false;
        const pay = this.patientsSaved * 800;
        this.worldManager.playerData.addCredits(pay);
    }

    receiveEmergencyCall(patientData) {
        if (!this.shiftStarted) return;
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Urgence vitale détectée : Trauma niveau ${patientData.severity}. Les coordonnées sont sur votre carte.`);
        }
    }

    performCPR(patientEntity, minigameSuccess) {
        if (!this.shiftStarted) return;

        if (minigameSuccess) {
            this.patientsSaved++;
            patientEntity.revive();
            this.worldManager.executeWorldImpact('citizen_saved_global');

            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Rythme cardiaque stabilisé. Bon travail, doc. Préparation du transport vers Trauma Center.");
            }
        } else {
            patientEntity.die();
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Le patient a expiré. Heure du décès enregistrée. Vous serez pénalisé sur votre prime.");
            }
        }
    }

    update() { }
}
