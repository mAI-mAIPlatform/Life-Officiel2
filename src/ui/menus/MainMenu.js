import { UIManager } from '../UIManager.js';
import { Events } from '../../utils/Events.js';
import { Logger } from '../../utils/Logger.js';

/**
 * LIFE RPG - Main Menu
 * Menu principal immersif avec esthétique Liquid Glass. Permet Start / Load / Settings.
 */
class MainMenu {
    constructor() {
        this.id = 'main';
        this.container = null;
    }

    init() {
        this._buildHTML();
        this._setupEvents();
        UIManager.registerMenu(this.id, this);
    }

    _buildHTML() {
        this.container = document.createElement('div');
        this.container.id = 'main-menu';
        // z-50 pour être pardessus hud, pointer-events-auto pour cliquer.
        this.container.className = 'absolute inset-0 w-full h-full z-50 pointer-events-auto opacity-0 hidden transition-opacity duration-1000 flex flex-col justify-center select-none';
        // Fond légèrement assombri additionnel
        this.container.style.background = 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)';

        this.container.innerHTML = `
            <div class="ml-[10%] max-w-lg">
                <h1 class="text-7xl font-black font-sans tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-neo-cyan to-neo-purple drop-shadow-[0_0_20px_rgba(0,243,255,0.4)] mb-2 inline-block">
                    LIFE
                </h1>
                <h2 class="text-xl font-mono tracking-[0.5em] text-neo-pink ml-2 opacity-80 mb-16">
                    OVERDRIVE
                </h2>

                <div class="flex flex-col gap-4 items-start relative z-10">
                    <button id="btn-main-new" class="group relative overflow-hidden bg-transparent border-0 text-white font-sans text-2xl font-bold uppercase tracking-widest px-4 py-2 text-left w-64 transition-all hover:text-neo-cyan hover:pl-8">
                        <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-neo-cyan transition-all group-hover:w-4"></span>
                        New Game
                    </button>
                    
                    <button id="btn-main-load" class="group relative overflow-hidden bg-transparent border-0 text-white/70 font-sans text-xl font-bold uppercase tracking-widest px-4 py-2 text-left w-64 transition-all hover:text-white hover:pl-8">
                        <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-white transition-all group-hover:w-4"></span>
                        Continue
                    </button>
                    
                    <button id="btn-main-settings" class="group relative overflow-hidden bg-transparent border-0 text-white/50 font-sans text-lg font-medium uppercase tracking-widest px-4 py-2 text-left w-64 transition-all hover:text-white hover:pl-8 mt-6">
                        <span class="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-white/50 transition-all group-hover:w-4"></span>
                        Settings
                    </button>
                    
                    <button id="btn-main-credits" class="group relative overflow-hidden bg-transparent border-0 text-white/30 font-sans text-sm font-medium uppercase tracking-widest px-4 py-2 text-left w-64 transition-all hover:text-white mt-2">
                        System Logs
                    </button>
                </div>
            </div>
            
            <div class="absolute bottom-8 right-8 text-right font-mono text-xs text-white/20">
                v1.0.0-Alpha<br>
                Core Engine Active
            </div>
        `;

        document.getElementById('ui-layer').appendChild(this.container);
    }

    _setupEvents() {
        document.getElementById('btn-main-new').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            // Ouvre le créateur de persos
            UIManager.openMenu('character_creator');
        });

        document.getElementById('btn-main-load').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            Events.emit('game:request_load');
            // Logique de boot game directe
        });

        document.getElementById('btn-main-settings').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            UIManager.openMenu('settings');
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
        }, 1000); // Durée de fade
    }
}

export const MenuMain = new MainMenu();
