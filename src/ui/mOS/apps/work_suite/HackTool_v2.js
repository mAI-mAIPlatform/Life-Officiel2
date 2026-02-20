import './work_suite_glass.css';

export class HackTool_v2 {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.isActive = false;
        this.element = null;
        this.connectionStatus = "OFFLINE";
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'mos-app hack-tool-v2 terminal-look';

        const consoleWindow = document.createElement('div');
        consoleWindow.className = 'hack-console';
        consoleWindow.innerHTML = `
            <div class="hack-header">root@ncpd-ghost:~# _</div>
            <ul class="log-output" id="hack-logs">
                <li>[INIT] NetRunner Suite v2.4 loaded.</li>
                <li>[WARN] Icebreaker module outdated. Connect at your own risk.</li>
            </ul>
            <div class="scan-button-container">
                <button class="hack-scan-btn">SCANNER RESEAUX PROCHES</button>
            </div>
        `;

        this.element.appendChild(consoleWindow);
        this.bindEvents();
        return this.element;
    }

    bindEvents() {
        const btn = this.element.querySelector('.hack-scan-btn');
        if (btn) {
            btn.addEventListener('click', () => this.scanNetwork());
        }
    }

    scanNetwork() {
        const logs = this.element.querySelector('#hack-logs');
        if (!logs) return;

        logs.innerHTML += `<li>> Scanning 802.11 b/g/n & Corpo-Nets...</li>`;
        setTimeout(() => {
            logs.innerHTML += `<li class="success">>> 3 Vulnérabilités trouvées (ATM, Caméra Sécurité, Drone Livraison)</li>`;
            this.uiManager.triggerMAI("Cibles de piratage acquises. Sélectionnez la cible via votre HUD AR et drainez leurs données.");
        }, 1500);
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
