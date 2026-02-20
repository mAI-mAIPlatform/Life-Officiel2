import './work_suite_glass.css';

export class mDispatch_App {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.isActive = false;
        this.element = null;
        this.missions = [];
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'mos-app mdispatch-app glass-panel';

        const header = document.createElement('div');
        header.className = 'app-header';
        header.innerHTML = '<h2>mDispatch</h2><div class="pulse-indicator"></div><p>Connexion au réseau de commande active</p>';

        const feed = document.createElement('div');
        feed.className = 'dispatch-feed';
        feed.id = 'dispatch-feed-container';

        this.element.appendChild(header);
        this.element.appendChild(feed);
        return this.element;
    }

    receiveDispatch(type, location, urgency) {
        const feed = this.element?.querySelector('#dispatch-feed-container');
        if (!feed) return;

        const alert = document.createElement('div');
        alert.className = `dispatch-alert urgency-${urgency} glass-card`;
        alert.innerHTML = `
            <strong>🚨 NOUVELLE ALERTE</strong>
            <p>Type: ${type}</p>
            <p>Secteur: ${location}</p>
            <button class="accept-dispatch">Accepter l'itinéraire</button>
        `;

        feed.prepend(alert);

        alert.querySelector('.accept-dispatch').addEventListener('click', () => {
            this.acceptDispatch(alert);
        });
    }

    acceptDispatch(alertElement) {
        alertElement.classList.add('accepted');
        alertElement.innerHTML = `<strong>✔ Coordonnées GPS verrouillées.</strong>`;
        this.uiManager.triggerMAI("Itinéraire tracé sur la mini-map. Temps estimé d'arrivée : 2 minutes.");
    }

    open() {
        this.isActive = true;
        this.render();
    }

    close() {
        this.isActive = false;
        if (this.element) this.element.remove();
    }
}
