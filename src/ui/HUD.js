import { Events } from '../utils/Events.js';
import { UIManager } from './UIManager.js';

/**
 * LIFE RPG - Heads Up Display (HUD)
 * Gère l'affichage en temps réel du joueur in-game (Santé, Argent, Heure, Armes).
 * Mise à jour pilotée par les événements plutôt que par la boucle de rendu pour max perf.
 */
class HUD {
    constructor() {
        this.id = 'hud';
        this.container = null;
        this.isShowing = false;

        // Cache DOM Elements pour éviter des getElementById intempestifs
        this.elHealthBar = null;
        this.elStaminaBar = null;
        this.elMoney = null;
        this.elTime = null;
        this.elAmmo = null;
        this.elWeaponName = null;
        this.elWantedLevel = null;
    }

    init() {
        this._buildHTML();
        this._setupListeners();
        UIManager.registerHUD(this);
    }

    _buildHTML() {
        this.container = document.createElement('div');
        this.container.id = 'hud-container';
        // Le Pointer-events-none est CRITIQUE. Sinon clic de souris sur l'UI empêche le tir !
        this.container.className = 'absolute inset-0 w-full h-full pointer-events-none z-10 hidden flex-col justify-between p-6 transition-opacity duration-300';

        this.container.innerHTML = `
            <!-- Top Bar: Temps & Wanted Level -->
            <div class="flex justify-between items-start w-full">
                <!-- Heure In-Game -->
                <div class="glass-panel px-4 py-2 flex items-center gap-3 backdrop-blur-md">
                    <div class="w-2 h-2 rounded-full bg-neo-cyan animate-pulse shadow-[0_0_8px_#00f3ff]"></div>
                    <span id="hud-time" class="font-mono text-xl font-bold tracking-widest text-white">08:00</span>
                    <span id="hud-day" class="font-mono text-xs text-white/50 ml-2">DAY 1</span>
                </div>
                
                <!-- Wanted Level (NCPD) -->
                <div id="hud-wanted" class="flex gap-1 opacity-0 transition-opacity">
                    <!-- Généré dynamiquement: Etoiles -->
                </div>
            </div>

            <!-- Bottom Bar: Status Joueur & Armes -->
            <div class="flex justify-between items-end w-full pb-4">
                
                <!-- Stats Joueur (Glassmorphism) -->
                <div class="glass-panel p-4 flex flex-col gap-3 min-w-[250px] relative overflow-hidden backdrop-blur-md border-l-4 border-l-neo-pink">
                    <!-- Scanline Déco -->
                    <div class="absolute inset-0 scanline opacity-20"></div>
                    
                    <!-- Santé -->
                    <div class="w-full relative z-10">
                        <div class="flex justify-between text-xs font-mono font-semibold mb-1">
                            <span class="text-white/80">HP</span>
                            <span id="hud-hp-text" class="text-neo-pink">100/100</span>
                        </div>
                        <div class="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                            <div id="hud-hp-bar" class="h-full bg-neo-pink shadow-neon-pink w-full transition-all duration-300 ease-out"></div>
                        </div>
                    </div>

                    <!-- Endurance -->
                    <div class="w-full relative z-10">
                        <div class="flex justify-between text-xs font-mono font-semibold mb-1">
                            <span class="text-white/80">STM</span>
                        </div>
                        <div class="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                            <div id="hud-stm-bar" class="h-full bg-neo-cyan shadow-neon-cyan w-full transition-all duration-100 ease-linear"></div>
                        </div>
                    </div>
                    
                    <!-- EuroDollars (Argent) -->
                    <div class="mt-2 flex items-center gap-2 font-mono z-10">
                        <span class="text-green-400 font-bold">€$</span>
                        <span id="hud-money" class="text-xl tracking-wider text-white">0</span>
                    </div>
                </div>

                <!-- Arme Actuelle & Ammo -->
                <div class="glass-panel p-4 flex items-end gap-6 backdrop-blur-md opacity-0 transition-opacity duration-300" id="hud-weapon-container">
                    <div class="flex flex-col items-end">
                        <span id="hud-weapon-name" class="font-sans font-bold text-sm text-white/70 uppercase tracking-widest mb-1">Vindicator 9mm</span>
                        <div class="font-mono text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            <span id="hud-ammo-clip">12</span>
                            <span class="text-white/30 text-xl mx-1">/</span>
                            <span id="hud-ammo-total" class="text-white/50 text-xl">48</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Crosshair (Réticule) Central -->
            <div id="hud-crosshair" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-50 transition-transform hidden">
                 <div class="w-1 h-1 bg-white rounded-full"></div>
                 <div class="absolute w-6 h-[1px] bg-white/50 left-[5px]"></div>
                 <div class="absolute w-6 h-[1px] bg-white/50 right-[5px]"></div>
                 <div class="absolute h-6 w-[1px] bg-white/50 top-[5px]"></div>
                 <div class="absolute h-6 w-[1px] bg-white/50 bottom-[5px]"></div>
            </div>
        `;

        document.getElementById('ui-layer').appendChild(this.container);

        // Mise en cache
        this.elHealthBar = document.getElementById('hud-hp-bar');
        this.elHealthText = document.getElementById('hud-hp-text');
        this.elStaminaBar = document.getElementById('hud-stm-bar');
        this.elMoney = document.getElementById('hud-money');
        this.elTime = document.getElementById('hud-time');
        this.elDay = document.getElementById('hud-day');

        this.elWeaponCont = document.getElementById('hud-weapon-container');
        this.elWeaponName = document.getElementById('hud-weapon-name');
        this.elAmmoClip = document.getElementById('hud-ammo-clip');
        this.elAmmoTotal = document.getElementById('hud-ammo-total');
        this.elCrosshair = document.getElementById('hud-crosshair');
    }

    _setupListeners() {
        // Temps
        Events.on('time:minute_passed', (data) => {
            if (this.elTime) this.elTime.textContent = data.str;
        });
        Events.on('time:new_day', (data) => {
            if (this.elDay) this.elDay.textContent = `DAY ${data.day}`;
        });

        // Joueur (Stats)
        Events.on('player:health_changed', (data) => {
            const pct = (data.current / data.max) * 100;
            if (this.elHealthBar) this.elHealthBar.style.width = `${pct}%`;
            if (this.elHealthText) this.elHealthText.textContent = `${Math.ceil(data.current)}/${data.max}`;

            if (pct <= 20) {
                this.elHealthBar.classList.add('animate-pulse', 'bg-red-600');
                this.elHealthBar.classList.remove('bg-neo-pink');
            } else {
                this.elHealthBar.classList.remove('animate-pulse', 'bg-red-600');
                this.elHealthBar.classList.add('bg-neo-pink');
            }
        });

        Events.on('player:stamina_changed', (data) => {
            const pct = (data.current / data.max) * 100;
            if (this.elStaminaBar) this.elStaminaBar.style.width = `${pct}%`;
        });

        Events.on('player:money_changed', (val) => {
            if (this.elMoney) {
                // Animation de formatage fluide (Optionellement on pourrait tween la valeur textuelle)
                this.elMoney.textContent = val.toLocaleString('en-US');
                // Feedback visuel court
                this.elMoney.classList.add('text-green-300', 'scale-110');
                setTimeout(() => {
                    this.elMoney.classList.remove('text-green-300', 'scale-110');
                }, 300);
            }
        });

        // Armes
        Events.on('player:weapon_equipped', (weapon) => {
            if (!weapon) {
                this.elWeaponCont.classList.add('opacity-0');
                this.elCrosshair.classList.add('hidden');
                return;
            }
            this.elWeaponCont.classList.remove('opacity-0');
            this.elCrosshair.classList.remove('hidden');
            this.elWeaponName.textContent = weapon.name;
            this._updateAmmo(weapon.clip, weapon.reserve);
        });

        Events.on('player:ammo_changed', (data) => {
            this._updateAmmo(data.clip, data.reserve);
        });

        Events.on('player:aiming', (isAiming) => {
            if (isAiming) {
                this.elCrosshair.classList.add('scale-50');
            } else {
                this.elCrosshair.classList.remove('scale-50');
            }
        });
    }

    _updateAmmo(clip, reserve) {
        if (this.elAmmoClip) this.elAmmoClip.textContent = clip;
        if (this.elAmmoTotal) this.elAmmoTotal.textContent = reserve;

        if (clip <= 3) {
            this.elAmmoClip.classList.add('text-red-500');
        } else {
            this.elAmmoClip.classList.remove('text-red-500');
        }
    }

    show() {
        this.container.classList.remove('hidden');
        // Pousser opacity au prochain frame pour transition CSS
        requestAnimationFrame(() => {
            this.container.classList.add('opacity-100');
        });
        this.isShowing = true;
    }

    hide() {
        this.container.classList.remove('opacity-100');
        setTimeout(() => {
            this.container.classList.add('hidden');
        }, 300);
        this.isShowing = false;
    }
}

export const HUDOverlay = new HUD();
