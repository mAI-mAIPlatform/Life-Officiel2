import { Logger } from './Logger.js';

/**
 * LIFE RPG - EventBus System (Pub/Sub)
 * Système de communication asynchrone découplé haute performance,
 * supporte les priorités, les channels et le wildcards ('*').
 */

class EventSystem {
    constructor() {
        this.events = new Map();
        // Optimisation: pool d'événements pour le dispatch async
        this.asyncQueue = [];
        this.isProcessingAsync = false;

        // Timeout pour éviter de lock la frame si trop d'events async
        this.ASYNC_TIME_BUDGET = 5; // ms par frame max pour les events
    }

    /**
     * S'abonne à un événement
     * @param {string} eventName Le nom de l'événement (ex: "player:health_changed")
     * @param {Function} callback La fonction à appeler
     * @param {number} priority 0 est le plus haut, priorités plus hautes exécutées en dernier
     * @param {object} context Le 'this' à utiliser lors de l'appel
     * @returns {string} L'ID unique de l'abonnement (pour unsuscribe facile)
     */
    on(eventName, callback, priority = 10, context = null) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        const id = Math.random().toString(36).substr(2, 9);
        const sub = {
            id,
            callback,
            priority,
            context,
            once: false
        };

        const list = this.events.get(eventName);
        list.push(sub);
        // Trier par priorité (ASC)
        list.sort((a, b) => a.priority - b.priority);

        return id;
    }

    /**
     * S'abonne à un événement pour une seule exécution
     */
    once(eventName, callback, priority = 10, context = null) {
        const id = this.on(eventName, callback, priority, context);
        // On cherche le sub qu'on vient d'ajouter pour flaguer 'once'
        const subs = this.events.get(eventName);
        const sub = subs.find(s => s.id === id);
        if (sub) sub.once = true;
        return id;
    }

    /**
     * Désarbonne soit un ID spécifique, soit tout un event si juste le nom est fourni
     */
    off(eventName, idOrCallback = null) {
        if (!this.events.has(eventName)) return false;

        if (!idOrCallback) {
            // Effacer complètement l'événement
            this.events.delete(eventName);
            return true;
        }

        const list = this.events.get(eventName);
        const initialLength = list.length;

        const isString = typeof idOrCallback === 'string';

        for (let i = list.length - 1; i >= 0; i--) {
            if ((isString && list[i].id === idOrCallback) ||
                (!isString && list[i].callback === idOrCallback)) {
                list.splice(i, 1);
            }
        }

        if (list.length === 0) {
            this.events.delete(eventName);
        }

        return list.length < initialLength;
    }

    /**
     * Émet un événement SYNCHRONEMENT (bloque le thread jusqu'à la fin de tous les callbacks)
     * Utile pour la physique ou l'input direct
     */
    emit(eventName, data = {}) {
        let count = 0;

        // Match exact
        if (this.events.has(eventName)) {
            count += this._invokeList(eventName, this.events.get(eventName), data);
        }

        // Match wildcard (ex: emit('player:health', {..}) matchera un on('player:*'))
        const parts = eventName.split(':');
        if (parts.length > 1) {
            const domain = parts[0];
            const wildcard = `${domain}:*`;
            if (this.events.has(wildcard)) {
                // Ajouter le vrai nom de l'événement dans la data pour que l'écouteur sache
                const enhancedData = { ...data, _wildcardTarget: eventName };
                count += this._invokeList(wildcard, this.events.get(wildcard), enhancedData);
            }
        }

        // Logger.trace('Core', `Event Emit [SYNC]: ${eventName} (${count} listeners)`);
        return count > 0;
    }

    /**
     * Émet un événement ASYNCHRONEMENT (ajouté à la queue et traité au prochain frame ou via processAsync)
     * Privilégier ça pour la UI, l'audio, ou des state changes non critiques !
     */
    emitAsync(eventName, data = {}) {
        this.asyncQueue.push({ eventName, data, timestamp: performance.now() });
    }

    /**
     * Appel interne pour trigger une liste de callbacks et gérer les "once"
     */
    _invokeList(eventName, list, data) {
        if (!list || list.length === 0) return 0;

        // Copie au cas où la liste est modifiée pendant l'itération (via on/off dans le callback)
        const snapshot = [...list];
        let execCount = 0;

        for (const sub of snapshot) {
            try {
                if (sub.context) {
                    sub.callback.call(sub.context, data);
                } else {
                    sub.callback(data);
                }
                execCount++;

                if (sub.once) {
                    this.off(eventName, sub.id);
                }
            } catch (error) {
                Logger.error('Core', `Event Callback Error inside [${eventName}]`, error);
            }
        }
        return execCount;
    }

    /**
     * Traite la queue des événements asynchrones. Doit être appelé dans la GameLoop.
     */
    processAsync() {
        if (this.asyncQueue.length === 0) return;

        this.isProcessingAsync = true;
        const startProcessing = performance.now();
        let processedCount = 0;

        // Processer jusqu'à vider la queue OU avoir dépassé le budget de temps
        while (this.asyncQueue.length > 0) {
            const { eventName, data } = this.asyncQueue.shift();
            this.emit(eventName, data);
            processedCount++;

            if (performance.now() - startProcessing > this.ASYNC_TIME_BUDGET) {
                Logger.warn('Core', `Async Event processing hit time budget limit (${this.ASYNC_TIME_BUDGET}ms). Remaining events: ${this.asyncQueue.length}`);
                break;
            }
        }

        this.isProcessingAsync = false;
    }

    /**
     * Vide tout
     */
    clearAll() {
        this.events.clear();
        this.asyncQueue = [];
    }
}

export const Events = new EventSystem();
