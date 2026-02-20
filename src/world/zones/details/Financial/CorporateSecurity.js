export class CorporateSecurity {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;
        this.alertLevel = 0; // 0 to 5
    }

    triggerAlarm(level) {
        this.alertLevel = level;
        console.log(`Corporate Security Alert Level: ${this.alertLevel}`);

        this.worldManager.executeWorldImpact('financial_lockdown');

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI(`ALERTE: La sécurité d'entreprise a été compromise. Niveau menage: ${this.alertLevel}. Des agents sont en route.`);
        }

        this.spawnGuards();
    }

    spawnGuards() {
        // Spawn security guards based on alert level
        const guardCount = this.alertLevel * 2;
        console.log(`Spawning ${guardCount} Corporate Guards.`);
        // Logic to spawn guards in the world
    }

    disableAlarm() {
        this.alertLevel = 0;
        console.log("Corporate Alarm Disabled");
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("L'alarme est désactivée. Vous êtes nouveau sous le radar.");
        }
        this.despawnGuards();
    }

    despawnGuards() {
        // Remove guards
    }

    update() {
        // Update security patrols
    }
}
