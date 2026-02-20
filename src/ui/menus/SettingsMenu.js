import { Events } from '../../utils/Events.js';
import { UIManager } from '../UIManager.js';
import { EngineConfig, AudioConfig } from '../../utils/Constants.js';

/**
 * LIFE RPG - Settings Menu
 * Panneau de configuration pour graphismes, audio et gameplay.
 */
class SettingsMenu {
    constructor() {
        this.id = 'settings';
        this.container = null;
    }

    init() {
        this._buildHTML();
        this._setupEvents();
        UIManager.registerMenu(this.id, this);
    }

    _buildHTML() {
        this.container = document.createElement('div');
        this.container.id = 'settings-menu';
        this.container.className = 'absolute inset-0 w-full h-full z-[60] pointer-events-auto opacity-0 hidden transition-opacity duration-300 flex items-center justify-center select-none bg-black/60 backdrop-blur-md';

        this.container.innerHTML = `
            <div class="glass-card w-[800px] h-[600px] flex flex-col shadow-2xl relative overflow-hidden">
                <!-- Header -->
                <div class="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 class="text-2xl font-bold tracking-widest text-white uppercase flex items-center gap-3">
                        <span class="text-neo-cyan">⚙</span> Configuration
                    </h2>
                    <button id="btn-settings-close" class="text-white/50 hover:text-white transition-colors text-xl font-bold">&times;</button>
                </div>
                
                <!-- Body Layout: Sidebar + Content -->
                <div class="flex flex-1 overflow-hidden">
                    <!-- Sidebar Tabs -->
                    <div class="w-1/4 border-r border-white/5 p-4 flex flex-col gap-2 bg-black/20">
                        <button class="settings-tab active glass-button text-left w-full border-neo-cyan text-neo-cyan" data-target="tab-video">Video</button>
                        <button class="settings-tab glass-button text-left w-full border-transparent" data-target="tab-audio">Audio</button>
                        <button class="settings-tab glass-button text-left w-full border-transparent" data-target="tab-controls">Controls</button>
                        <button class="settings-tab glass-button text-left w-full border-transparent" data-target="tab-gameplay">Gameplay</button>
                    </div>
                    
                    <!-- Content Area -->
                    <div class="flex-1 p-8 overflow-y-auto no-scrollbar relative">
                        
                        <!-- TAB: VIDEO -->
                        <div id="tab-video" class="settings-pane block space-y-6">
                            <h3 class="text-xl font-mono text-white/80 mb-4 border-b border-white/10 pb-2">Graphics</h3>
                            
                            <div class="flex justify-between items-center">
                                <span class="text-white/70">Shadow Quality</span>
                                <select id="set-shadows" class="bg-black/50 border border-white/20 text-white rounded px-3 py-1 outline-none focus:border-neo-cyan">
                                    <option value="off">Off</option>
                                    <option value="low">Low (1024)</option>
                                    <option value="high" selected>High (2048)</option>
                                    <option value="ultra">Ultra (4096)</option>
                                </select>
                            </div>
                            
                            <div class="flex justify-between items-center">
                                <span class="text-white/70">Anti-Aliasing</span>
                                <label class="relative inline-flex items-center cursor-pointer">
                                  <input type="checkbox" id="set-aa" class="sr-only peer" checked>
                                  <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neo-cyan shadow-neon-cyan"></div>
                                </label>
                            </div>
                        </div>

                        <!-- TAB: AUDIO -->
                        <div id="tab-audio" class="settings-pane hidden space-y-6">
                            <h3 class="text-xl font-mono text-white/80 mb-4 border-b border-white/10 pb-2">Volume</h3>
                            
                            <div class="space-y-2">
                                <div class="flex justify-between text-sm text-white/70">
                                    <span>Master</span>
                                    <span id="set-vol-master-val">100%</span>
                                </div>
                                <input type="range" id="set-vol-master" min="0" max="100" value="100" class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neo-cyan">
                            </div>

                            <div class="space-y-2">
                                <div class="flex justify-between text-sm text-white/70">
                                    <span>Music</span>
                                    <span id="set-vol-music-val">50%</span>
                                </div>
                                <input type="range" id="set-vol-music" min="0" max="100" value="50" class="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neo-pink">
                            </div>
                        </div>

                        <!-- TAB: CONTROLS (Placeholder UI) -->
                        <div id="tab-controls" class="settings-pane hidden space-y-4">
                            <h3 class="text-xl font-mono text-white/80 mb-4 border-b border-white/10 pb-2">Keybindings</h3>
                            <p class="text-white/50 text-sm">Keybinding mapping will be available here.</p>
                        </div>
                        
                        <!-- TAB: GAMEPLAY (Placeholder UI) -->
                        <div id="tab-gameplay" class="settings-pane hidden space-y-4">
                            <h3 class="text-xl font-mono text-white/80 mb-4 border-b border-white/10 pb-2">Preferences</h3>
                            <p class="text-white/50 text-sm">Difficulty, Subtitles, HUD toggles will be here.</p>
                        </div>
                        
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="px-8 py-4 border-t border-white/10 flex justify-end gap-3 bg-white/5">
                    <button id="btn-settings-apply" class="glass-button text-neo-cyan border-neo-cyan hover:bg-neo-cyan/10">Apply Changes</button>
                </div>
            </div>
        `;

        document.getElementById('ui-layer').appendChild(this.container);
    }

    _setupEvents() {
        const closeBtn = document.getElementById('btn-settings-close');

        closeBtn.addEventListener('click', () => {
            Events.emit('ui:click_sound');
            // Retour au menu parent logique
            UIManager.closeMenu();
            // TODO: si on était depuis le MainMenu, retourner dessus. Pour l'instant closeMenu gère le fait de popper la pile.
        });

        // Tabs Logic
        const tabs = this.container.querySelectorAll('.settings-tab');
        const panes = this.container.querySelectorAll('.settings-pane');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                Events.emit('ui:click_sound');

                // Reset tous les tabs
                tabs.forEach(t => {
                    t.classList.remove('border-neo-cyan', 'text-neo-cyan');
                    t.classList.add('border-transparent');
                });
                panes.forEach(p => p.classList.add('hidden'));

                // Active le cliqué
                const targetId = e.target.getAttribute('data-target');
                e.target.classList.remove('border-transparent');
                e.target.classList.add('border-neo-cyan', 'text-neo-cyan');
                document.getElementById(targetId).classList.remove('hidden');
            });
        });

        // Sliders updates text
        const updateSliderText = (idSlider, idVal) => {
            const slider = document.getElementById(idSlider);
            const val = document.getElementById(idVal);
            slider.addEventListener('input', (e) => {
                val.textContent = `${e.target.value}%`;
            });
        };
        updateSliderText('set-vol-master', 'set-vol-master-val');
        updateSliderText('set-vol-music', 'set-vol-music-val');

        // Apply
        document.getElementById('btn-settings-apply').addEventListener('click', () => {
            Events.emit('ui:click_sound');
            // Collect values
            const masterVol = parseInt(document.getElementById('set-vol-master').value) / 100;
            const musicVol = parseInt(document.getElementById('set-vol-music').value) / 100;
            const shadowType = document.getElementById('set-shadows').value;

            Events.emit('settings:apply', { masterVol, musicVol, shadowType });

            UIManager.showNotification({
                title: 'SYSTEM',
                message: 'Paramètres mis à jour.',
                type: 'success'
            });
        });
    }

    show() {
        this.container.classList.remove('hidden');
        requestAnimationFrame(() => {
            this.container.classList.add('opacity-100');
        });
    }

    hide() {
        this.container.classList.remove('opacity-100');
        setTimeout(() => {
            this.container.classList.add('hidden');
        }, 300);
    }
}

export const MenuSettings = new SettingsMenu();
