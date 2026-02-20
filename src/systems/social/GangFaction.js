import { Events } from '../../utils/Events.js';

export class GangFaction {
    constructor() {
        this.factions = ['neon_skulls', 'iron_bloods'];
    }

    triggerGangWar(location) {
        Events.emit('world:gang_war_started', location);
        // Idéalement on spawn des NPCs des deux gangs et on leur set un BrainAI 'COMBAT' ciblant l'autre
    }
}

export class CorporateFaction {
    constructor() {
        this.corpos = ['arasaka', 'militech'];
    }

    sendKillSquad(playerPos) {
        Events.emit('world:corpo_squad_dispatched', playerPos);
        // Fonctionnement similaire à PoliceAI mais avec des assets différents
    }
}
