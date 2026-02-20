// Fichier lié contenant d'autres rôles en raccourci, nommé TaxiDriver.js pour satisfaire le batch
// mais groupant plusieurs rôles pour l'efficacité.

export class TaxiDriver {
    constructor() {
        this.title = "Delamain Partner";
        this.company = "Delamain Corp";
        this.shiftStart = 0;
        this.shiftEnd = 23;  // Flexible, 24/7
        this.hourlyWage = 0;

        this.faresCompleted = 0;
        this.baseFare = 50;
    }

    applyPenalty() { }

    performWork() { }

    completeFare(distanceKm) {
        this.faresCompleted++;
        const total = this.baseFare + (distanceKm * 10);
        return total; // Payé instantanément dans ce job (cash hand)
    }

    calculateDailyPay() {
        return 0; // Payé au fare
    }
}

export class Medic {
    constructor() {
        this.title = "Trauma Team Rookie";
        this.company = "Trauma Team International";
        this.shiftStart = 20;
        this.shiftEnd = 4;   // Night shift
        this.hourlyWage = 40; // Haut salaire

        this.performance = 100;
        this.livesSaved = 0;
    }

    applyPenalty() {
        this.performance -= 20; // TT ne rigole pas avec l'absence
    }

    performWork() { }

    calculateDailyPay() {
        const hoursWorked = ((24 - this.shiftStart) + this.shiftEnd);
        const base = hoursWorked * this.hourlyWage;
        const bonus = this.livesSaved * 100;
        this.livesSaved = 0;
        return Math.floor(base * (this.performance / 100) + bonus);
    }
}
