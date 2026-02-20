import { UIConfig } from '../../utils/Constants.js';
import { Events } from '../../utils/Events.js';
import { Logger } from '../../utils/Logger.js';
import { Input } from '../../core/InputHandler.js';

/**
 * LIFE RPG - mOS Core (Mobile OS)
 * Le coeur du smartphone in-game. Gère le cycle de vie des apps (ouverture, fermeture, background),
 * l'affichage du téléphone, et la navigation (Home Button).
 */
class MOSManager {
    constructor() {
        this.container = null;
        this.isOpen = false;

        this.apps = new Map(); // Instances des applications enregistrées
        this.activeApp = null;

        // Eléments UI
        this.elScreen = null;
        this.elHomeBtn = null;
        this.elTopBar = null;
    }

    init() {
        this.container = document.getElementById('mos-container');
        if (!this.container) return Logger.error('mOS', 'Container introuvable');

        this._buildFrame();
        this._setupEvents();
        Logger.info('mOS', 'Operating System "Neon" booté.');
    }

    _buildFrame() {
        // Le wrapper physique du téléphone (Coque)
        this.container.innerHTML = `
            <div class="relative w-full h-full bg-neo-black rounded-[40px] border-[6px] border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
                
                <!-- Screen Glow Effect -->
                <div class="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,243,255,0.1)] pointer-events-none z-50"></div>
                
                <!-- Status Bar -->
                <div id="mos-statusbar" class="h-8 w-full px-5 flex items-center justify-between z-[60] bg-black/50 backdrop-blur-sm text-[10px] font-mono text-white tracking-widest border-b border-white/5">
                    <span id="mos-time">08:00</span>
                    <div class="flex items-center gap-2">
                        <span class="text-neo-cyan">5G</span>
                        <div class="flex gap-0.5 h-2 items-end">
                            <div class="w-1 h-1 bg-white"></div>
                            <div class="w-1 h-1.5 bg-white"></div>
                            <div class="w-1 h-2 bg-white/30"></div>
                        </div>
                        <span id="mos-battery" class="ml-1 text-green-400">98%</span>
                    </div>
                </div>

                <!-- App Viewport (L'écran lui même) -->
                <div id="mos-screen" class="flex-1 relative bg-[url('/textures/ui/mos_bg.jpg')] bg-cover bg-center">
                    
                    <!-- L'écran d'accueil avec les icones -->
                    <div id="mos-homescreen" class="absolute inset-0 p-6 grid grid-cols-4 gap-4 content-start transition-opacity duration-300">
                        ${this._generateAppIcons()}
                    </div>

                    <!-- App Container: Là où les HTML des apps sont injectés -->
                    <div id="mos-app-layer" class="absolute inset-0 bg-neo-black translate-y-full transition-transform duration-300 z-40 overflow-hidden">
                        <!-- Content goes here -->
                    </div>
                </div>

                <!-- Home Button (Zone tactile basse) -->
                <div id="mos-homebtn" class="h-6 w-full flex items-center justify-center pb-2 cursor-pointer z-[60] bg-black/80 hover:bg-black transition-colors">
                    <div class="w-24 h-1 rounded-full bg-white/30 transition-all hover:bg-white/80"></div>
                </div>
            </div>
        `;

        this.elScreen = document.getElementById('mos-app-layer');
        this.elHomeBtn = document.getElementById('mos-homebtn');
        const homeScreen = document.getElementById('mos-homescreen');

        // Bind des app icons
        UIConfig.MOS.APPS.forEach(appDef => {
            const el = document.getElementById(`mos-app-btn-${appDef.id}`);
            if (el) {
                el.addEventListener('click', () => this.launchApp(appDef.id));
            }
        });

        // Bouton home = go_home ou close_phone si deja home
        this.elHomeBtn.addEventListener('click', () => {
            Events.emit('ui:click_sound');
            if (this.activeApp) {
                this.returnToHome();
            } else {
                this.togglePhone(); // Ferme le tel si clique sur home depuis l'accueil
            }
        });
    }

    _generateAppIcons() {
        return UIConfig.MOS.APPS.map(app => `
            <div id="mos-app-btn-${app.id}" class="flex flex-col items-center gap-1 cursor-pointer group">
                <div class="w-[60px] h-[60px] rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 shadow-lg group-hover:scale-110" style="background-color: ${app.color}22; border: 1px solid ${app.color}55; color: ${app.color};">
                    ${app.icon}
                </div>
                <span class="text-[10px] font-sans font-medium text-white/80 group-hover:text-white mt-1 shadow-black drop-shadow-md">
                    ${app.name}
                </span>
            </div>
        `).join('');
    }

    _setupEvents() {
        Events.on('input:action_mos', () => this.togglePhone());

        Events.on('time:minute_passed', (d) => {
            const t = document.getElementById('mos-time');
            if (t) t.textContent = d.str;
        });
    }

    /**
     * Enregistre le code d'une App
     */
    registerApp(appInstance) {
        this.apps.set(appInstance.id, appInstance);
        // Injecte dans le DOM caché
        const wrapper = document.createElement('div');
        wrapper.id = `mos-wrapper-${appInstance.id}`;
        wrapper.className = 'absolute inset-0 hidden flex-col transition-opacity duration-200';
        wrapper.innerHTML = typeof appInstance.renderHTML === 'function' ? appInstance.renderHTML() : '';
        this.elScreen.appendChild(wrapper);

        if (typeof appInstance.onMount === 'function') {
            appInstance.onMount(wrapper);
        }
    }

    togglePhone() {
        if (this.isOpen) {
            this.container.classList.add('translate-y-full');
            this.container.classList.remove('pointer-events-auto');
            this.isOpen = false;

            // Re-lock mouse if needed
            Input.requestPointerLock();
            Events.emit('mos:closed');
            Events.emit('ui:click_sound');
        } else {
            this.container.classList.remove('translate-y-full');
            this.container.classList.add('pointer-events-auto');
            this.isOpen = true;

            Input.exitPointerLock();
            Events.emit('mos:opened');
            Events.emit('ui:click_sound');
        }
    }

    launchApp(appId) {
        if (!this.apps.has(appId)) {
            Logger.warn('mOS', `Application ${appId} non installée.`);
            return;
        }

        const app = this.apps.get(appId);
        this.activeApp = app;

        // Afficher l'écran app-layer de bas en haut
        this.elScreen.classList.remove('translate-y-full');

        // Cacher les autres apps
        this.apps.forEach((a, k) => {
            const w = document.getElementById(`mos-wrapper-${k}`);
            if (w) {
                if (k === appId) {
                    w.classList.remove('hidden');
                    // Timeout minimal pour que le DOM reprenne son souffle avant transition CSS (opacity)
                    requestAnimationFrame(() => w.classList.add('opacity-100'));
                } else {
                    w.classList.remove('opacity-100');
                    w.classList.add('hidden');
                }
            }
        });

        if (typeof app.onOpen === 'function') {
            app.onOpen();
        }
    }

    returnToHome() {
        if (!this.activeApp) return;

        if (typeof this.activeApp.onClose === 'function') {
            this.activeApp.onClose();
        }

        const w = document.getElementById(`mos-wrapper-${this.activeApp.id}`);
        if (w) w.classList.remove('opacity-100');

        this.elScreen.classList.add('translate-y-full');

        setTimeout(() => {
            if (w) w.classList.add('hidden');
            this.activeApp = null;
        }, 300); // Wait for translation animation
    }
}

export const mOS = new MOSManager();
