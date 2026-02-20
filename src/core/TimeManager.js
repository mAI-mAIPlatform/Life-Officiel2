import { WorldConfig, EngineConfig } from '../utils/Constants.js';
import { Events } from '../utils/Events.js';
import { Logger } from '../utils/Logger.js';

/**
 * LIFE RPG - Time Manager
 * Gère le temps in-game, le cycle jour/nuit de manière continue et précise.
 * Synchronisé avec le GameLoop pour avancer le temps de la simulation.
 */
class TimeManager {
    constructor() {
        // Temps in-game courant (en secondes depuis 00:00:00)
        this.currentTimeRaw = WorldConfig.TIME.START_TIME;

        // Multiplicateur : Combien de secondes in-game passent pour 1 seconde réelle
        // Ex: 1440 ratio = 24 minutes pour 24 heures IG
        this.timeScale = (24 * 3600) / WorldConfig.TIME.REAL_SECONDS_PER_GAME_DAY;

        // Cache du format string
        this.timeString = "08:00";
        this.dayCount = 1;

        this.isPaused = false;

        // Pré-calculs pour le soleil
        this.sunAngle = 0;
        this.isDay = true;
    }

    /**
     * Initialise et branche le manager à la boucle de jeu
     */
    init() {
        Logger.info('World', `TimeManager initialisé. Ratio: 1s sec temps réel = ${this.timeScale.toFixed(2)}s IG`);

        // On écoute le tick fixe du GameLoop (pas le render paramétrable)
        // pour s'assurer que le temps avance de manière déterministe
        this.updateTimeStr();
        this._calculateSunAngle();
        Events.emit('time:initialized', { timeStr: this.timeString, day: this.dayCount, isDay: this.isDay });
    }

    /**
     * Avance le temps. Devient appelé par la GameLoop.
     * @param {number} fixedDelta Temps fixe en secondes (ex: 0.016)
     */
    update(fixedDelta) {
        if (this.isPaused) return;

        // On avance le chrono interne en se basant sur le delta et l'échelle
        const timeAdvance = fixedDelta * this.timeScale;
        this.currentTimeRaw += timeAdvance;

        let dayRollover = false;

        // Gestion du minuit (86400 secondes = 24 * 3600)
        if (this.currentTimeRaw >= 86400) {
            this.currentTimeRaw -= 86400;
            this.dayCount++;
            dayRollover = true;
            Logger.info('World', `Nouvelle journée in-game : Jour ${this.dayCount}`);
            Events.emit('time:new_day', { day: this.dayCount });
        }

        // On met à jour l'état périodiquement (pas besoin de calculer les strings à chaque tick 60fps)
        // Une astuce : on le fait si on a passé la minute, mais pour la précision du soleil 
        // on fait le calcul d'angle à chaque tick fixe.
        const prevMin = this.getMinutes();
        this._calculateSunAngle();
        const currentMin = this.getMinutes();

        if (prevMin !== currentMin || dayRollover) {
            this.updateTimeStr();
            Events.emit('time:minute_passed', { time: this.currentTimeRaw, str: this.timeString });
        }
    }

    /**
     * Calcule l'inclinaison du soleil dans le ciel (0 à TWO_PI)
     * Utile pour positionner le DirectionalLight principal
     */
    _calculateSunAngle() {
        // midi (12h00) = 43200 secondes
        // Angle : 0 (minuit), PI/2 (6h), PI (12h), 3PI/2 (18h)
        const percentOfDay = this.currentTimeRaw / 86400;
        this.sunAngle = percentOfDay * Math.PI * 2;

        // La journée est de dawnStart à duskStart environ
        const wasDay = this.isDay;
        const dawnSecs = WorldConfig.TIME.DAWN_START * 3600;
        const duskSecs = WorldConfig.TIME.DUSK_START * 3600;

        this.isDay = this.currentTimeRaw >= dawnSecs && this.currentTimeRaw <= duskSecs;

        if (wasDay !== this.isDay) {
            if (this.isDay) {
                Logger.info('World', 'Le jour se lève sur NeoCity.');
                Events.emit('time:sunrise');
            } else {
                Logger.info('World', 'La nuit tombe sur NeoCity.');
                Events.emit('time:sunset');
            }
        }
    }

    /**
     * Met en pause l'écoulement du temps (HUD, Menus)
     */
    setPaused(state) {
        this.isPaused = state;
    }

    /**
     * Règle manuellement l'heure in-game (ex: dormir dans un lit)
     */
    setTime(hours, minutes) {
        this.currentTimeRaw = (hours * 3600) + (minutes * 60);
        this.updateTimeStr();
        this._calculateSunAngle();
        Events.emit('time:jump', { timeStr: this.timeString, raw: this.currentTimeRaw });
        Logger.debug('World', `Temps sauté à : ${this.timeString}`);
    }

    /**
     * Avance le temps de X heures (Fast Forward, ex: prison, repos)
     */
    fastForward(hours) {
        let newTime = this.currentTimeRaw + (hours * 3600);

        // Gestion propre d'un passage au lendemain complexe
        while (newTime >= 86400) {
            newTime -= 86400;
            this.dayCount++;
            Events.emit('time:new_day', { day: this.dayCount });
        }

        this.currentTimeRaw = newTime;
        this.updateTimeStr();
        this._calculateSunAngle();
        Events.emit('time:fast_forward_complete', { newTime: this.currentTimeRaw });
    }

    getHours() {
        return Math.floor(this.currentTimeRaw / 3600);
    }

    getMinutes() {
        return Math.floor((this.currentTimeRaw % 3600) / 60);
    }

    updateTimeStr() {
        const h = String(this.getHours()).padStart(2, '0');
        const m = String(this.getMinutes()).padStart(2, '0');
        this.timeString = `${h}:${m}`;
    }

    getTimeString() {
        return this.timeString;
    }

    getSunAngle() {
        return this.sunAngle;
    }

    getIsDay() {
        return this.isDay;
    }

    // Utilisé pour sérialiser la sauvegarde
    getSaveData() {
        return {
            timeRaw: this.currentTimeRaw,
            dayCount: this.dayCount
        };
    }

    // Récupérer depuis une sauvegarde
    loadSaveData(data) {
        if (!data) return;
        this.currentTimeRaw = data.timeRaw || WorldConfig.TIME.START_TIME;
        this.dayCount = data.dayCount || 1;
        this.updateTimeStr();
        this._calculateSunAngle();
    }
}

export const Time = new TimeManager();
