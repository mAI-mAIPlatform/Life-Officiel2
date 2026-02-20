import { Events } from '../../utils/Events.js';
import { UIManager } from '../UIManager.js';

/**
 * LIFE RPG - Pause Menu
 * Overlay semi-transparent par dessus le jeu (blur Liquid Glass).
 */
class PauseMenu {
    constructor() {
        this.id = 'pause';
        this.container = null;
    }

    init() {
        this._buildHTML();
        this._setupEvents();
        UIManager.registerMenu(this.id, this);
    }

    _buildHTML() {
        this.container = document.createElement('div');
        this.container.id = 'pause-menu';
        // Flexbox centré, par défaut caché et opacité 0
        this.container.className = 'absolute inset-0 w-full h-full z-50 pointer-events-auto opacity-0 hidden transition-opacity duration-300 flex items-center justify-center select-none';

        this.container.innerHTML = `
            <div class="glass-card w-96 p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
                <!-- Glitch line decoration -->
                <div class="absolute left-0 top-0 w-1 h-full bg-neo-cyan/50 shadow-neon-cyan"></div>
                
                <h2 class="text-4xl font-black tracking-widest text-white mb-2 uppercase drop-shadow-md">Paused</h2>
                <div class="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>
                
                <div class="flex flex-col gap-3 w-full">
                    <button id="btn-pause-resume" class="glass-button w-full text-center">Resume</button>
                    <button id="btn-pause-save" class="glass-button w-full text-center">Save Game</button>
                    <button id="btn-pause-load" class="glass-button w-full text-center">Load Game</button>
                    <button id="btn-pause-settings" class="glass-button w-full text-center">Settings</button>
                    <div class="h-px w-full bg-white/10 my-2"></div>
                    <button id="btn-pause-quit" class="glass-button w-full text-center border-red-500/30 hover:bg-red-500/10 hover:border-red-500 hover:text-red-400">Quit to Title</button>
                </div>
            </div>
        `;

        document.getElementById('ui-layer').appendChild(this.container);
    }

    _setupEvents() {
        document.getElementById('btn-pause-resume').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            UIManager.closeMenu();
            Events.emit('gameloop:resume');
        });

        document.getElementById('btn-pause-save').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            Events.emit('game:request_save');
        });

        document.getElementById('btn-pause-load').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            Events.emit('game:request_load');
        });

        document.getElementById('btn-pause-settings').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            UIManager.openMenu('settings');
        });

        document.getElementById('btn-pause-quit').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            // Retour main menu (Reset scene)
            Events.emit('game:quit_to_main');
        });
    }

    show(data) {
        this.container.classList.remove('hidden');
        requestAnimationFrame(() => {
            this.container.classList.add('opacity-100');
        });
    }

    hide() {
        this.container.classList.remove('opacity-100');
        setTimeout(() => {
            if (!this.container.classList.contains('opacity-100')) {
                this.container.classList.add('hidden');
            }
        }, 300);
    }
}

export const MenuPause = new PauseMenu();
