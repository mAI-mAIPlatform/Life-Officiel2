import { Events } from '../../utils/Events.js';
import { Player } from '../../entities/player/Player.js';

/**
 * LIFE RPG - Job & Career Manager
 * Gère l'emploi actuel du joueur (Salaire horaire, horaires de travail fixes, 
 * pénalités si absence) et les Gig / Missions de mafieux.
 */
class CareerManager {
    constructor() {
        this.activeJob = null; // Objet pointant vers un "Job Role" type OfficeWorker.js
        this.activeMissions = []; // Gigs illégales ou freelance
        this.completedMissions = [];
    }

    init() {
        Events.on('time:hour_passed', (data) => this._checkWorkSchedule(data.hours));
    }

    /**
     * Engage le joueur dans un emploi "Légal" et fixe.
     * @param {Object} jobModule Une instance d'une carriere (ex: new OfficeWorker())
     */
    hire(jobModule) {
        if (this.activeJob) {
            this.quitJob();
        }
        this.activeJob = jobModule;
        Events.emit('ui:show_notification', { title: "CAREER", message: `Hired as ${jobModule.title}`, type: "success" });
    }

    quitJob() {
        if (this.activeJob) {
            Events.emit('ui:show_notification', { title: "CAREER", message: `Quit job at ${this.activeJob.company}`, type: "info" });
            this.activeJob = null;
        }
    }

    _checkWorkSchedule(currentHour) {
        if (!this.activeJob) return;

        // Exemple: Shif de 9h à 17h
        if (currentHour >= this.activeJob.shiftStart && currentHour <= this.activeJob.shiftEnd) {
            // Le joueur doit théoriquement être dans la zone du job pour pointer.
            // S'il n'y est pas, il perd de la "Work Performance"
            if (!this._isPlayerAtWorkspace()) {
                this.activeJob.applyPenalty();
            } else {
                this.activeJob.performWork();
            }
        }

        // Payer à la fin du shift
        if (currentHour === this.activeJob.shiftEnd + 1) {
            const pay = this.activeJob.calculateDailyPay();
            Player.addMoney(pay);
            Events.emit('ui:show_notification', { title: "PAYDAY", message: `Received €$${pay} from ${this.activeJob.company}`, type: "money" });
        }
    }

    _isPlayerAtWorkspace() {
        // En vrai: WorldManager checkZone() ou trigger collider de l'immeuble Corpo.
        // Mock => On dit que si l'app Job est ouverte on "travaille" (Clicker game) pour l'instant
        return true;
    }

    // --- MISSIONS & GIGS (Freelance) ---

    acceptGig(missionData) {
        this.activeMissions.push(missionData);
        Events.emit('ui:show_notification', { title: "NEW GIG", message: missionData.title, type: "info" });
    }

    completeGig(missionId) {
        const index = this.activeMissions.findIndex(m => m.id === missionId);
        if (index > -1) {
            const m = this.activeMissions[index];
            Player.addMoney(m.payout);
            this.completedMissions.push(m);
            this.activeMissions.splice(index, 1);

            // TODO: Ajouter REP/XP au faction manager

            Events.emit('ui:show_notification', { title: "GIG COMPLETED", message: m.title, type: "success" });
        }
    }
}

export const JobManager = new CareerManager();
