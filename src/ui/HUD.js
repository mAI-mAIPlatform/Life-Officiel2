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
        this.container = document.getElementById('hud-container');
        if (!this.container) {
            console.error("HUD Container #hud-container introuvable dans index.html !");
            return;
        }

        // Mise en cache des éléments CSS Pur (Liquid Glass)
        this.elHealthBar = document.getElementById('hud-hp-bar');
        this.elHealthText = document.getElementById('hud-hp');
        this.elStaminaBar = document.getElementById('hud-sta-bar');
        this.elMoney = document.getElementById('hud-money');

        // Eléments potentiellement absents du nouveau HTML de base (on les gérera sans crash s'ils n'existent pas)
        this.elTime = document.getElementById('hud-time');
        this.elDay = document.getElementById('hud-day');

        this.elWeaponCont = document.querySelector('.hud-weapon-panel');
        this.elWeaponName = document.getElementById('hud-weapon-name');

        // Modification: la nouvelle UI n'a qu'un span #hud-ammo pour tout
        this.elAmmo = document.getElementById('hud-ammo');

        this.elCrosshair = document.querySelector('.hud-crosshair');
        this.elWanted = document.getElementById('hud-wanted');
        this.elWantedStars = document.getElementById('hud-stars');
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
