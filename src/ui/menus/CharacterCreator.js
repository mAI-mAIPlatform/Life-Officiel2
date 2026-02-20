import { Events } from '../../utils/Events.js';
import { UIManager } from '../UIManager.js';

/**
 * LIFE RPG - Character Creator
 * Menu complexe permettant de créer le profil, choisir le background (StreeKid, Corpo, Nomad),
 * et de distribuer les attributs de départ.
 */
class CharacterCreator {
    constructor() {
        this.id = 'character_creator';
        this.container = null;

        // Données temporaires de création
        this.charData = {
            name: '',
            background: 'streetkid',
            stats: { strength: 5, agility: 5, intelligence: 5, charisma: 5 },
            cash: 500
        };
        this.pointsToSpend = 10;
    }

    init() {
        this._buildHTML();
        this._setupEvents();
        UIManager.registerMenu(this.id, this);
    }

    _buildHTML() {
        this.container = document.createElement('div');
        this.container.id = 'char-creator-menu';
        this.container.className = 'absolute inset-0 w-full h-full z-40 pointer-events-auto opacity-0 hidden transition-opacity duration-500 bg-neo-black text-white flex select-none';

        this.container.innerHTML = `
            <!-- Zone Gauche : Formulaire et Stats -->
            <div class="w-1/3 bg-black/40 backdrop-blur-xl border-r border-white/10 h-full p-10 flex flex-col justify-between overflow-y-auto no-scrollbar relative z-10 shadow-[5px_0_30px_rgba(0,0,0,0.8)]">
                
                <div>
                    <h2 class="text-3xl font-black font-mono tracking-widest text-neo-cyan mb-8 border-b-2 border-neo-cyan inline-block pb-2">NEW PROFILE</h2>
                    
                    <!-- Identification -->
                    <div class="mb-8">
                        <label class="block text-xs uppercase tracking-widest text-white/50 mb-2">Alias / Identité</label>
                        <input type="text" id="cc-name" placeholder="V" class="w-full bg-white/5 border border-white/20 p-3 rounded font-mono text-xl focus:border-neo-pink focus:outline-none transition-colors" autocomplete="off" maxlength="20">
                    </div>

                    <!-- Lifepath (Origins) -->
                    <div class="mb-10">
                        <label class="block text-xs uppercase tracking-widest text-white/50 mb-4">Lifepath. Origine.</label>
                        <div class="flex flex-col gap-3">
                            <button class="cc-lifepath glass-button border-neo-pink text-neo-pink flex justify-between items-center" data-path="streetkid">
                                <span>STREETKID</span>
                                <span class="text-xs opacity-70">+ Agility</span>
                            </button>
                            <button class="cc-lifepath glass-card p-2 px-6 flex justify-between items-center border border-white/10 text-white/70 hover:border-white/30" data-path="corpo">
                                <span>CORPO</span>
                                <span class="text-xs opacity-70">+ Charisma</span>
                            </button>
                            <button class="cc-lifepath glass-card p-2 px-6 flex justify-between items-center border border-white/10 text-white/70 hover:border-white/30" data-path="nomad">
                                <span>NOMAD</span>
                                <span class="text-xs opacity-70">+ Strength</span>
                            </button>
                        </div>
                        <p id="cc-desc-origin" class="mt-4 text-sm text-white/60 font-sans leading-relaxed h-16">
                            Né dans le caniveau, élevé par les gangs. Vous connaissez les rues de NeoCity mieux que quiconque.
                        </p>
                    </div>

                    <!-- Attributs -->
                    <div>
                        <div class="flex justify-between items-center mb-4">
                            <label class="text-xs uppercase tracking-widest text-white/50">Attributs Génétiques</label>
                            <div class="text-neo-cyan font-mono text-sm bg-neo-cyan/10 px-2 py-1 rounded">RESTANT: <span id="cc-points" class="font-bold">10</span></div>
                        </div>
                        
                        <div class="space-y-4 font-mono">
                            ${this._createStatRow('STR', 'strength')}
                            ${this._createStatRow('AGI', 'agility')}
                            ${this._createStatRow('INT', 'intelligence')}
                            ${this._createStatRow('CHA', 'charisma')}
                        </div>
                    </div>
                </div>

                <!-- Footer Check -->
                <button id="btn-cc-start" class="w-full bg-neo-cyan text-black font-black text-xl py-4 mt-8 uppercase tracking-[0.2em] hover:bg-white hover:text-neo-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    INITIALIZE LINK
                </button>
            </div>
            
            <!-- Zone Droite : Aperçu 3D (Simulé ici par du vide, mais transparent pour voir la scene ThreeJS en fond) -->
            <div class="w-2/3 h-full relative">
                <!-- Grille décorative cyberpunk overlay -->
                <div class="absolute inset-0 pointer-events-none" style="background-image: linear-gradient(rgba(0, 243, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px); background-size: 50px 50px; opacity: 0.5;"></div>
                
                <div class="absolute bottom-10 left-10 p-6 glass-panel backdrop-blur-md max-w-sm">
                    <h3 class="font-bold text-neo-cyan mb-2 flex items-center gap-2"><span>👁️</span> SCAN BIOMÉTRIQUE</h3>
                    <p class="text-sm font-mono text-white/70">Ajustez l'apparence physique de votre avatar dans l'espace 3D.</p>
                    <p class="text-xs text-white/30 mt-2">Cliquez et glissez pour tourner le modèle.</p>
                </div>
            </div>
        `;

        document.getElementById('ui-layer').appendChild(this.container);
    }

    _createStatRow(label, statKey) {
        return `
            <div class="flex justify-between items-center bg-black/30 p-2 rounded border border-white/5">
                <span class="w-10 text-white/80">${label}</span>
                <div class="flex items-center gap-4">
                    <button class="cc-stat-sub w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded disabled:opacity-30" data-stat="${statKey}">-</button>
                    <span id="cc-val-${statKey}" class="w-4 text-center font-bold text-lg">5</span>
                    <button class="cc-stat-add w-6 h-6 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded disabled:opacity-30" data-stat="${statKey}">+</button>
                </div>
            </div>
        `;
    }

    _setupEvents() {
        // Name validation
        const nameInput = document.getElementById('cc-name');
        const startBtn = document.getElementById('btn-cc-start');

        nameInput.addEventListener('input', (e) => {
            this.charData.name = e.target.value.trim();
            // Demande un nom d'au moins 2 chars et max 12
            startBtn.disabled = this.charData.name.length < 2 || this.pointsToSpend > 0;
        });

        // Lifepaths
        const lpBtns = this.container.querySelectorAll('.cc-lifepath');
        const descP = document.getElementById('cc-desc-origin');
        const texts = {
            'streetkid': 'Né dans le caniveau, élevé par les gangs. Vous connaissez les rues de NeoCity mieux que quiconque. L\'instinct de survie est une seconde nature.',
            'corpo': 'Costume sur mesure, implants dernier cri. Vous avez tout perdu quand votre division a été purgée. Mais vous connaissez encore leurs secrets.',
            'nomad': 'Les Badlands étaient votre maison jusqu\'à ce que la famille se déchire. Vous êtes une force brute débarquant en ville pour un nouveau départ.'
        };

        lpBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.currentTarget;
                const path = targetBtn.getAttribute('data-path');
                this.charData.background = path;

                // Styling Reset
                lpBtns.forEach(b => {
                    b.className = 'cc-lifepath glass-card p-2 px-6 flex justify-between items-center border border-white/10 text-white/70 hover:border-white/30 transition-all';
                });

                // Active Styling
                targetBtn.className = 'cc-lifepath glass-button border-neo-pink text-neo-pink flex justify-between items-center ring-2 ring-neo-pink/30 transition-all';

                // Update Desc
                descP.textContent = texts[path];
                Events.emit('ui:click_sound');
            });
        });

        // Stats Addition/Subtraction
        const ptsEl = document.getElementById('cc-points');
        const updateUI = () => {
            ptsEl.textContent = this.pointsToSpend;
            ['strength', 'agility', 'intelligence', 'charisma'].forEach(k => {
                document.getElementById(`cc-val-${k}`).textContent = this.charData.stats[k];
            });
            startBtn.disabled = this.charData.name.length < 2 || this.pointsToSpend > 0;
        };

        this.container.querySelectorAll('.cc-stat-add').forEach(b => {
            b.addEventListener('click', (e) => {
                const s = e.currentTarget.getAttribute('data-stat');
                if (this.pointsToSpend > 0 && this.charData.stats[s] < 10) {
                    this.charData.stats[s]++;
                    this.pointsToSpend--;
                    Events.emit('ui:click_sound');
                    updateUI();
                }
            });
        });

        this.container.querySelectorAll('.cc-stat-sub').forEach(b => {
            b.addEventListener('click', (e) => {
                const s = e.currentTarget.getAttribute('data-stat');
                if (this.charData.stats[s] > 3) {
                    this.charData.stats[s]--;
                    this.pointsToSpend++;
                    Events.emit('ui:click_sound');
                    updateUI();
                }
            });
        });

        // Finalize
        startBtn.addEventListener('click', () => {
            Events.emit('ui:click_sound');
            // Ajuster l'argent de départ selon le BG par ex.
            if (this.charData.background === 'corpo') this.charData.cash = 10000;
            if (this.charData.background === 'nomad') this.charData.cash = 200;
            if (this.charData.background === 'streetkid') this.charData.cash = 1000;

            UIManager.closeMenu();
            // Dire au jeu principal de démarrer l'intro 
            Events.emit('game:start_new', this.charData);
        });
    }

    show(data) {
        // Optionnel : Dire au manager de caméra 3D de se placer devant le perso pour l'aperçu
        Events.emit('camera:cut_to_character_creator');

        // Reset state
        this.charData.name = '';
        this.pointsToSpend = 10;
        document.getElementById('cc-name').value = '';
        document.getElementById('btn-cc-start').disabled = true;

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
        }, 500);
    }
}

export const MenuCharacterCreator = new CharacterCreator();
