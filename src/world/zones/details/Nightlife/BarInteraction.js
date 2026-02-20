export class BarInteraction {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.isActive = false;

        this.boundingBox = {
            min: { x: 550, y: 0, z: 620 },
            max: { x: 580, y: 20, z: 650 }
        };
    }

    checkPlayerPresence() {
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
        this.spawnBartender();

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Le bar The Rusty Gear. Les locaux ici ont souvent des informations sur les marchés noirs, moyennant quelques verres.");
        }
    }

    deactivateZone() {
        this.isActive = false;
        this.despawnBartender();
    }

    spawnBartender() { }
    despawnBartender() { }

    buyDrink() {
        this.worldManager.executeWorldImpact('player_drunk_level_increase');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Taux d'alcoolémie en hausse. Vos réflexes de combat et votre précision seront altérés.");
        }
    }

    payForRumors() {
        this.worldManager.executeWorldImpact('rumor_network_unlocked');
    }

    update() {
        this.checkPlayerPresence();
        if (!this.isActive) return;
    }
}
