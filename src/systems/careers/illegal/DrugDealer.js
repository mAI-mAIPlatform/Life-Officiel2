import { Events } from '../../../utils/Events.js';
import { Player } from '../../../entities/player/Player.js';

export class DrugDealer {
    constructor() {
        this.title = "Street Chemist";
        this.heat = 0; // Jauge de risque
    }

    sellProduct(amount, pricePerUnit) {
        // En vrai: checker if Player.inventory has product.
        const total = amount * pricePerUnit;
        Player.addMoney(total);

        this.heat += amount * 0.1;
        Events.emit('ui:show_notification', { title: "DEAL DONE", message: `Sold ${amount} unit(s) for €$${total}`, type: "money" });

        if (this.heat > 5) {
            Events.emit('ui:show_notification', { title: "HEAT TOO HIGH", message: "Cops alerted to your position.", type: "error" });
            Events.emit('player:crime_committed', 2);
            this.heat = 0;
        }
    }
}

export class Hitman {
    constructor() {
        this.title = "Mercenary / Hitman";
        this.contractsCompleted = 0;
    }

    acceptContract(targetId, payout) {
        // Géré par JobManager/Gigs en réalité.
        // On mock la logique
        Events.emit('ui:show_notification', { title: "CONTRACT ACCEPTED", message: `Eliminate target for €$${payout}`, type: "info" });
    }

    confirmKill(targetId) {
        // Appelé par le CombatManager quand targetId meurt
        this.contractsCompleted++;
        // Payout via le Fixer / JobManager
    }
}
