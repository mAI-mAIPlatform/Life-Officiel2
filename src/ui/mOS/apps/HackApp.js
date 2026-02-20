import { Events } from '../../../utils/Events.js';
import { Logger } from '../../../utils/Logger.js';

export class HackApp {
    constructor() {
        this.id = 'hack';
        this.container = null;
        this.isOpen = false;

        // Terminal log history state
        this.logs = [
            "Initializing NetDaemon v4.4.2...",
            "Bypassing ICE protocols...",
            "Local environment secure.",
            "Waiting for target lock."
        ];
    }

    renderHTML() {
        return `
            <div class="w-full h-full bg-black text-[#ff1100] font-mono flex flex-col overflow-hidden relative border-2 border-[#ff1100]/20">
                <!-- Overlay Scanline Hardcore -->
                <div class="absolute inset-0 scanline opacity-30 pointer-events-none mix-blend-overlay"></div>
                <!-- Vignette noire -->
                <div class="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,1)] pointer-events-none"></div>

                <!-- Header "Hacker" -->
                <div class="px-4 py-2 bg-[#ff1100]/20 text-white text-xs font-bold tracking-[0.3em] flex justify-between uppercase">
                    <span>NET_RUNNER</span>
                    <span class="animate-pulse text-[#ff1100]">Rooted</span>
                </div>

                <!-- Target Info Box -->
                <div class="p-4 border-b border-[#ff1100]/30 hidden" id="hack-target-panel">
                    <div class="flex justify-between text-xs mb-1">
                        <span class="text-white/50">TARGET:</span>
                        <span id="hack-target-name" class="font-bold text-white">NCPD_DRONE_44R</span>
                    </div>
                    <div class="flex justify-between text-[10px] mb-3 text-[#ff1100]/70">
                        <span>SECURITY:</span>
                        <span id="hack-target-sec">TIER 3 (ICE-Breaker Req)</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <button class="hack-action-btn bg-[#ff1100] text-black font-bold p-2 hover:bg-white text-xs transition-colors" data-action="ping">PING</button>
                        <button class="hack-action-btn bg-black border border-[#ff1100] text-[#ff1100] p-2 hover:bg-[#ff1100] hover:text-black text-xs transition-colors" data-action="breach">BREACH</button>
                        <button class="hack-action-btn bg-black border border-[#ff1100] text-[#ff1100] p-2 hover:bg-[#ff1100] hover:text-black text-xs transition-colors col-span-2 opacity-50" data-action="overload" disabled>OVERLOAD CIRCUIT</button>
                    </div>
                </div>

                <!-- Terminal Output -->
                <div class="flex-1 p-4 overflow-y-auto w-full text-xs space-y-1" id="hack-terminal">
                    <!-- Logs générés via js -->
                </div>
                
                <!-- No target blinking overlay -->
                <div id="hack-idle" class="absolute inset-0 flex flex-col items-center justify-center opacity-70 z-10 bg-black/80">
                    <span class="text-4xl">📡</span>
                    <span class="mt-4 animate-pulse tracking-widest text-[#ff1100]">SCANNING FOR VULNERABILITIES...</span>
                </div>
            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;
        this._renderTerminal();

        // Listen pour les cibles de piratage à proximité (Émis par le Raycaster principal du joueur / HUD)
        Events.on('hack:target_acquired', (targetData) => {
            this.setTarget(targetData);
        });

        Events.on('hack:target_lost', () => {
            this.clearTarget();
        });

        // Binds Buttons
        this.container.querySelectorAll('.hack-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                Events.emit('ui:click_sound');
                this.executeAction(action);
            });
        });
    }

    onOpen() {
        this.isOpen = true;
    }

    onClose() {
        this.isOpen = false;
        // Laisser la cible si on rouvre ou pas ? En général le piratage requiert de viser physiquement dans le jeu.
    }

    _renderTerminal() {
        const term = this.container.querySelector('#hack-terminal');
        if (!term) return;

        term.innerHTML = this.logs.map(l => {
            if (l.includes('ERROR') || l.includes('FAILED')) {
                return `<div class="bg-[#ff1100]/20 text-white">&gt; ${l}</div>`;
            } else if (l.includes('SUCCESS') || l.includes('BYPASS')) {
                return `<div class="text-[#00ffaa]">&gt; ${l}</div>`;
            }
            return `<div>&gt; ${l}</div>`;
        }).join('');

        // Auto scroll bas
        term.scrollTop = term.scrollHeight;
    }

    addLog(text) {
        this.logs.push(text);
        if (this.logs.length > 50) this.logs.shift(); // Garde les 50 dernières
        if (this.isOpen) this._renderTerminal();
    }

    setTarget(data) {
        this.addLog(`[TARGET LOCKED] ID: ${data.id}`);
        // data.name, data.securityLevel (1-5)
        this.container.querySelector('#hack-target-panel').classList.remove('hidden');
        this.container.querySelector('#hack-idle').classList.add('hidden');

        this.container.querySelector('#hack-target-name').textContent = data.name;
        this.container.querySelector('#hack-target-sec').textContent = `TIER ${data.securityLevel}`;

        // Activer / désactiver des boutons selon le niveau ICE 
    }

    clearTarget() {
        this.addLog(`[TARGET LOST] Connection dropped.`);
        this.container.querySelector('#hack-target-panel').classList.add('hidden');
        this.container.querySelector('#hack-idle').classList.remove('hidden');
    }

    executeAction(actionType) {
        this.addLog(`Executing: ${actionType.toUpperCase()}`);

        // Simule un temps de chargement/réponse
        setTimeout(() => {
            if (actionType === 'ping') {
                this.addLog(`SUCCESS: Target is active. Distance 14m.`);
            } else if (actionType === 'breach') {
                this.addLog(`[BREACH PROTOCOL STARTED]`);
                Events.emit('hack:request_minigame');
                // Cela devrait ouvrir le fameux mini-jeu de chiffres hexa de cyberpunk ou équivalent
                UIManager.closeMenu(); // on ferme le tel et va au minigame ?
            }
        }, 500);
    }
}
