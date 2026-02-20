export class HeistPlanner {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.activeHeist = null;
        this.crew = [];
        this.intelGathered = 0;
    }

    startPlanningPhase(heistData) {
        this.activeHeist = heistData;
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Cible définie : ${heistData.target}. Réunissez l'équipage et rassemblez des informations sur la sécurité. Ce ne sera pas une promenade de santé.`);
        }
    }

    recruitCrewMember(npcId, role) {
        if (!this.activeHeist) return;
        this.crew.push({ id: npcId, role });
        console.log(`Recruited ${npcId} as ${role}. Total crew: ${this.crew.length}`);
    }

    gatherIntel(location) {
        if (!this.activeHeist) return;
        this.intelGathered++;

        if (this.intelGathered >= this.activeHeist.requiredIntel) {
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Toutes les données de sécurité acquises. Le plan est prêt, en attente de votre ordre pour lancer le raid.");
            }
        }
    }

    executeHeist() {
        if (!this.activeHeist || this.intelGathered < this.activeHeist.requiredIntel) return false;

        this.worldManager.executeWorldImpact('city_alert_triggered');
        this.worldManager.triggerGlobalEvent("heist_started", {
            location: this.activeHeist.target,
            severity: this.activeHeist.reward / 10000
        });

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Go, go, go ! Les masques sont mis. Neutralisez les caméras avant de vous attaquer au coffre.");
        }

        return true;
    }

    finishHeist(success, lootAmount) {
        if (success) {
            this.worldManager.playerData.addCredits(lootAmount);
            this.worldManager.playerData.increaseWantedLevel(3);
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI(`Coup parfait. ${lootAmount} téléchargés. Séparez-vous avant que les MaxTac n'arrivent.`);
            }
        } else {
            this.worldManager.playerData.increaseWantedLevel(5);
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Échec. Sortez d'ici au plus vite ou préparez-vous à finir à la morgue.");
            }
        }

        this.activeHeist = null;
        this.crew = [];
        this.intelGathered = 0;
    }
}
