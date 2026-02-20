import { Events } from '../../../utils/Events.js';

export class OfficeWorker {
    constructor() {
        this.title = "Data Entry Clerk";
        this.company = "Arasaka Logistics";
        this.shiftStart = 9;  // 9 AM
        this.shiftEnd = 17;   // 5 PM
        this.hourlyWage = 15; // €$ 15/hr

        this.performance = 100; // 0 à 100%
    }

    applyPenalty() {
        this.performance -= 10;
        if (this.performance < 0) this.performance = 0;
        if (this.performance < 30) {
            Events.emit('ui:show_notification', { title: "HR WARNING", message: "Your attendance is unacceptable.", type: "error" });
        }
    }

    performWork() {
        // Si le joueur est actif dans les locaux, la perf remonte/se maintient
        if (this.performance < 100) {
            this.performance += 2;
        }
    }

    calculateDailyPay() {
        const hoursWorked = this.shiftEnd - this.shiftStart;
        const maxPay = hoursWorked * this.hourlyWage;
        // La paye est pondérée par la performance
        const actualPay = maxPay * (this.performance / 100);
        return Math.floor(actualPay);
    }
}

export class Delivery {
    constructor() {
        this.title = "Food Couriour";
        this.company = "Noodle Prime";
        this.shiftStart = 18; // 6 PM
        this.shiftEnd = 23;   // 11 PM
        this.hourlyWage = 0; // Pas de fixe, payé à la course

        this.completedDeliveriesTemp = 0;
        this.payPerTip = 25;
    }

    applyPenalty() {
        // Pas de pénalités fixes en gig economy, juste pas d'argent
    }

    performWork() {
        // Simulé: Si le joueur conduit la moto de livraison et atteint des waypoints
        // Ce logic flow devrait être trigger par un collider de cible
    }

    markDeliveryDone() {
        this.completedDeliveriesTemp++;
        Events.emit('ui:show_notification', { title: "DELIVERY", message: `Drop-off successful. (+€$${this.payPerTip})`, type: "success" });
    }

    calculateDailyPay() {
        const pay = this.completedDeliveriesTemp * this.payPerTip;
        this.completedDeliveriesTemp = 0; // Reset for next shift
        return pay;
    }
}
