export class BouncerAI {
    constructor(worldManager, position) {
        this.worldManager = worldManager;
        this.position = position;
        this.patience = 100;
        this.hostile = false;
    }

    interact(playerReputation, bribeAmount) {
        if (this.hostile) return "HOSTILE";

        if (playerReputation > 50 || bribeAmount >= 500) {
            this.letPlayerPass();
            return "GRANTED";
        } else {
            this.declineEntry();
            return "DENIED";
        }
    }

    letPlayerPass() {
        console.log("Bouncer steps aside.");
        this.worldManager.executeWorldImpact('club_entry_granted');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Accès autorisé. Entrée dans le club Neon validée.");
        }
    }

    declineEntry() {
        this.patience -= 20;
        console.log("Bouncer crosses arms.");
        if (this.patience <= 0) {
            this.becomeHostile();
        }
    }

    becomeHostile() {
        this.hostile = true;
        this.worldManager.executeWorldImpact('bouncer_combat_initiated');
        this.worldManager.triggerGlobalEvent("street_fight_started");
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Alerte: Le videur est devenu hostile. Préparez-vous au combat ou fuyez.");
        }
    }
}
