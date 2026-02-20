export class DrugDealing_Logic {
    constructor(worldManager, player) {
        this.worldManager = worldManager;
        this.player = player;
        this.inventory = {
            "neon_dust": 0,
            "synth_adrenaline": 0
        };
        this.activeDeals = 0;
    }

    buyStock(drugType, amount) {
        const cost = this.getMarketPrice(drugType) * amount * 0.7; // buy wholesale
        if (this.worldManager.playerData.hasCredits(cost)) {
            this.worldManager.playerData.removeCredits(cost);
            this.inventory[drugType] += amount;

            if (this.worldManager.ui) {
                this.worldManager.ui.triggerMAI(`Achat de ${amount}x ${drugType}. Livré à votre planque.`);
            }
        }
    }

    setupCorner(locationData) {
        this.activeDeals++;
        // Start passive income loop
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Point de vente établi. Gardez un oeil sur vos revendeurs, les gangs rivaux sont territoriaux.");
        }
    }

    executeSale(drugType, npcBuyer) {
        if (this.inventory[drugType] > 0) {
            const price = this.getMarketPrice(drugType);
            this.inventory[drugType]--;
            this.worldManager.playerData.addCredits(price);

            // Risk of police
            if (Math.random() < 0.1) {
                this.worldManager.playerData.increaseWantedLevel(1);
                if (this.worldManager.ui) {
                    this.worldManager.ui.triggerMAI("Attention, drone de la NCPD repéré lors de l'échange. Profil bas.");
                }
            }

            return true;
        }
        return false;
    }

    getMarketPrice(drugType) {
        // dynamic pricing logic
        const basePrice = drugType === "neon_dust" ? 100 : 250;
        const demandModifier = Math.random() + 0.5;
        return Math.floor(basePrice * demandModifier);
    }

    raidStockpile() {
        this.inventory = { "neon_dust": 0, "synth_adrenaline": 0 };
        this.worldManager.executeWorldImpact('stash_raided');
        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Alerte rouge : La police a fait une descente sur votre planque. Tout le stock est perdu.");
        }
    }
}
