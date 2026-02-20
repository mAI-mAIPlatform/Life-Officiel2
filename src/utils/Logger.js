import { DebugConfig } from './Constants.js';

/**
 * LIFE RPG - Advanced Logging System
 * Un système de log complet avec filtrage, couleurs, persistance optionnelle
 * et export pour le debug console in-game.
 */

// Niveaux de log
export const LogLevel = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5,
    NONE: 6
};

// Map des niveaux vers chaînes pour l'affichage
const LevelNames = {
    [LogLevel.TRACE]: 'TRACE',
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.FATAL]: 'FATAL'
};

// Couleurs CSS pour la console du navigateur
const LevelColors = {
    [LogLevel.TRACE]: 'color: #808080',
    [LogLevel.DEBUG]: 'color: #00f3ff',
    [LogLevel.INFO]: 'color: #00ff88',
    [LogLevel.WARN]: 'color: #ffaa00; font-weight: bold',
    [LogLevel.ERROR]: 'color: #ff1100; font-weight: bold; font-size: 1.1em',
    [LogLevel.FATAL]: 'color: #ffffff; background: #ff0000; font-weight: bold; padding: 2px 4px; border-radius: 3px'
};

// Couleurs par défaut pour différents sous-systèmes
const SubsystemColors = {
    'Core': 'color: #b026ff',
    'Engine': 'color: #0088ff',
    'Physics': 'color: #ff8800',
    'World': 'color: #22cc22',
    'Player': 'color: #ee22ee',
    'AI': 'color: #ffff00',
    'UI': 'color: #00cccc',
    'Audio': 'color: #ff00ff',
    'Network': 'color: #888888',
    'SaveSys': 'color: #bbcc00'
};

class LoggerSystem {
    constructor() {
        this.currentLevel = LogLevel[DebugConfig.LOG_LEVEL] || LogLevel.INFO;
        this.history = []; // Pour la console in-game développeur
        this.maxHistory = 1000;
        this.subsystems = new Set();
        this.mutedSubsystems = new Set();
        this.consoleListeners = [];

        // Timer de démarrage pour les timestamps relatifs
        this.startTime = performance.now();
    }

    /**
     * Définit le niveau global de logging (filtre tout ce qui est en dessous)
     * @param {number} level 
     */
    setLevel(level) {
        if (Object.values(LogLevel).includes(level)) {
            this.currentLevel = level;
        }
    }

    /**
     * Permet de muter (ignorer) un sous-système spécifique
     * @param {string} subsystem 
     */
    muteSubsystem(subsystem) {
        this.mutedSubsystems.add(subsystem);
    }

    /**
     * Réactive un sous-système muté
     * @param {string} subsystem 
     */
    unmuteSubsystem(subsystem) {
        this.mutedSubsystems.delete(subsystem);
    }

    /**
     * Ajoute un écouteur qui recevra tous les logs (utile pour afficher dans la console HUD in-game)
     * @param {Function} callback 
     */
    addConsoleListener(callback) {
        if (typeof callback === 'function') {
            this.consoleListeners.push(callback);
        }
    }

    /**
     * Récupère timestamp formatté
     * @returns {string} "[00:00:00.000]"
     */
    _getFormattedTime() {
        const date = new Date();
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        const s = String(date.getSeconds()).padStart(2, '0');
        const ms = String(date.getMilliseconds()).padStart(3, '0');

        const relative = ((performance.now() - this.startTime) / 1000).toFixed(2);

        return `[+${relative}s | ${h}:${m}:${s}.${ms}]`;
    }

    /**
     * Fonction interne de log process
     */
    _log(level, subsystem, message, data = null) {
        // Ignorer si en dessous du niveau de log, ou si le sous-système est muté
        if (level < this.currentLevel || this.mutedSubsystems.has(subsystem)) return;

        this.subsystems.add(subsystem);

        const timeStr = this._getFormattedTime();
        const levelStr = LevelNames[level].padEnd(5, ' ');
        const subStr = `[${subsystem}]`.padEnd(12, ' ');

        const levelStyle = LevelColors[level] || '';
        const subStyle = SubsystemColors[subsystem] || 'color: #aaaaaa';
        const resetStyle = 'color: inherit; font-weight: normal; background: transparent';

        // Construction du message string pour l'historique et les listeners
        const plainMessage = `${timeStr} ${levelStr} ${subStr} ${message}`;

        // Stocker dans l'historique
        const logEntry = {
            time: timeStr,
            level: level,
            levelName: levelStr.trim(),
            subsystem: subsystem,
            message: message,
            data: data
        };

        this.history.push(logEntry);
        if (this.history.length > this.maxHistory) {
            this.history.shift(); // Garde seulement les N derniers
        }

        // Notifier les UI Listeners (Console In-Game par exemple)
        for (const listener of this.consoleListeners) {
            listener(logEntry);
        }

        // Toujours afficher dans le vrai console navigateur en développement
        if (DebugConfig.ENABLED || level >= LogLevel.ERROR) {
            const cssFormat = `%c${timeStr}%c %c${levelStr}%c %c${subStr}%c ${message}`;
            const cssArgs = [
                'color: #666666', resetStyle,
                levelStyle, resetStyle,
                subStyle, resetStyle
            ];

            if (data) {
                // Utiliser les fonctions natives selon la sévérité pour avoir les stack traces etc.
                if (level >= LogLevel.ERROR) {
                    console.error(cssFormat, ...cssArgs, data);
                } else if (level === LogLevel.WARN) {
                    console.warn(cssFormat, ...cssArgs, data);
                } else if (level === LogLevel.TRACE || level === LogLevel.DEBUG) {
                    console.debug(cssFormat, ...cssArgs, data);
                } else {
                    console.log(cssFormat, ...cssArgs, data);
                }
            } else {
                if (level >= LogLevel.ERROR) {
                    console.error(cssFormat, ...cssArgs);
                } else if (level === LogLevel.WARN) {
                    console.warn(cssFormat, ...cssArgs);
                } else if (level === LogLevel.TRACE || level === LogLevel.DEBUG) {
                    console.debug(cssFormat, ...cssArgs);
                } else {
                    console.log(cssFormat, ...cssArgs);
                }
            }
        }
    }

    // ============================================
    // API PUBLIQUE
    // ============================================

    trace(subsystem, message, data = null) {
        this._log(LogLevel.TRACE, subsystem, message, data);
    }

    debug(subsystem, message, data = null) {
        this._log(LogLevel.DEBUG, subsystem, message, data);
    }

    info(subsystem, message, data = null) {
        this._log(LogLevel.INFO, subsystem, message, data);
    }

    warn(subsystem, message, data = null) {
        this._log(LogLevel.WARN, subsystem, message, data);
    }

    error(subsystem, message, data = null) {
        this._log(LogLevel.ERROR, subsystem, message, data);
    }

    fatal(subsystem, message, data = null) {
        this._log(LogLevel.FATAL, subsystem, message, data);
        // Possibilité de trigger un "Blue Screen" In-Game ici s'il y a un fatal error
        if (window && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('LIFE_FATAL_ERROR', { detail: { subsystem, message, data } }));
        }
    }

    /**
     * Chronomètre une opération et log le temps écoulé
     * @param {string} subsystem 
     * @param {string} operationName 
     * @param {Function} callback 
     */
    time(subsystem, operationName, callback) {
        if (this.currentLevel > LogLevel.DEBUG || this.mutedSubsystems.has(subsystem)) {
            return callback(); // Ne pas mesurer si on n'est pas en debug ou si mute
        }

        const start = performance.now();
        const result = callback();

        // Gérer les promesses (async callbacks)
        if (result instanceof Promise) {
            return result.then(res => {
                const end = performance.now();
                this.debug(subsystem, `${operationName} took ${(end - start).toFixed(2)}ms`);
                return res;
            }).catch(err => {
                const end = performance.now();
                this.error(subsystem, `${operationName} FAILED after ${(end - start).toFixed(2)}ms`, err);
                throw err;
            });
        } else {
            const end = performance.now();
            this.debug(subsystem, `${operationName} took ${(end - start).toFixed(2)}ms`);
            return result;
        }
    }

    dumpHistory() {
        return [...this.history];
    }

    clearHistory() {
        this.history = [];
    }
}

// Singleton export
export const Logger = new LoggerSystem();
