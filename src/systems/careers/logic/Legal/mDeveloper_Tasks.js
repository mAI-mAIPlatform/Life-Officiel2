export class mDeveloper_Tasks {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.activeTask = null;
        this.tasksCompleted = 0;
    }

    assignTask(taskData) {
        this.activeTask = taskData;
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`Nouveau ticket Jira-Neo: ${taskData.title}. Il semblerait qu'il y ait une faille dans le sous-système de trafic.`);
        }
    }

    playCodingMinigame() {
        // Triggers UI coding puzzle
        return true; // Simulating win
    }

    submitCode(success) {
        if (!this.activeTask) return;

        if (success) {
            this.tasksCompleted++;

            // WORLD IMPACT based on what was developed
            if (this.activeTask.type === "server_optimization") {
                this.worldManager.executeWorldImpact('city_servers_speed_up');
                if (this.worldManager.ui) {
                    this.worldManager.ui.triggerMAI("Déploiement en production réussi. Les serveurs de la ville sont 15% plus rapides aujourd'hui. Bonus mServices accordé.");
                }
            } else {
                if (this.worldManager.ui) {
                    this.worldManager.ui.triggerMAI("Code mergé. Votre manager est satisfait.");
                }
            }

            this.worldManager.playerData.addCredits(this.activeTask.reward);
        } else {
            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI("Erreur de compilation lors du déploiement. Le serveur local a crashé. Vous avez reçu un blâme.");
            }
        }

        this.activeTask = null;
    }
}
