import { Events } from '../utils/Events.js';
import { UIConfig } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';
import { Input } from '../core/InputHandler.js';

/**
 * LIFE RPG - UI Manager (Vanilla JS)
 * Orchestrateur central de l'interface Liquid Glass. Gère le cycle de vie des menus,
 * du HUD, et s'assure qu'un seul menu bloquant n'est actif à la fois.
 */
class UIManagerSystem {
    constructor() {
        this.baseLayer = null; // Div '#ui-layer'

        // Sous-composants
        this.activeMenu = null;
        this.hudInstance = null;

        // Cache des instances de menus
        this.menus = new Map();

        this.isInitialized = false;

        // Pour bloquer les inputs de jeu quand l'UI a le focus
        this.isInputBlockedByUI = false;
    }

    init() {
        if (this.isInitialized) return;

        this.baseLayer = document.getElementById('ui-layer');
        if (!this.baseLayer) {
            Logger.fatal('UI', 'Impossible de trouver #ui-layer dans index.html');
            return;
        }

        // Ecoute des Inputs globaux pour fermer/ouvrir des menus
        this._setupInputListeners();

        Events.on('ui:show_notification', this.showNotification.bind(this));

        this.isInitialized = true;
        Logger.info('UI', 'UIManager Controller Initialisé.');
    }

    _setupInputListeners() {
        // Appelé quand le joueur appuie sur Echap/Start
        Events.on('input:action_pause', () => {
            if (this.activeMenu && this.activeMenu.id !== 'pause') {
                // Fermer le menu courant si ce n'est pas pause
                this.closeMenu();
            } else if (this.activeMenu && this.activeMenu.id === 'pause') {
                // Reprendre le jeu
                this.closeMenu();
                Events.emit('gameloop:resume');
            } else {
                // Ouvrir pause
                this.openMenu('pause');
                Events.emit('gameloop:pause');
            }
        });
    }

    /**
     * Enregistre l'instance d'un menu dans le système
     */
    registerMenu(id, menuInstance) {
        this.menus.set(id, menuInstance);
    }

    /**
     * Enregistre le HUD principal
     */
    registerHUD(hudInstance) {
        this.hudInstance = hudInstance;
    }

    /**
     * Ouvre un menu spécifique (ex: 'main', 'pause', 'inventory')
     */
    openMenu(id, data = null) {
        if (!this.menus.has(id)) {
            Logger.error('UI', `Tentative d'ouverture d'un menu inconnu: ${id}`);
            return;
        }

        // Fermer l'ancien
        if (this.activeMenu) {
            this.activeMenu.hide();
        }

        this.activeMenu = this.menus.get(id);

        // Relacher le pointerlock du navigateur pour que la souris appraisse
        Input.exitPointerLock();
        this.isInputBlockedByUI = true;

        // Si le menu a besoin de flouter le monde derrière (Effet Liquid Glass avancé)
        this.baseLayer.classList.add('backdrop-blur-sm', 'bg-black/20');

        this.activeMenu.show(data);
        Events.emit('ui:menu_opened', id);
        Logger.debug('UI', `Menu Ouvert: ${id}`);
    }

    /**
     * Ferme le menu courant et retourne au Game
     */
    closeMenu() {
        if (!this.activeMenu) return;

        const id = this.activeMenu.id;
        this.activeMenu.hide();
        this.activeMenu = null;

        // Retirer le blur
        this.baseLayer.classList.remove('backdrop-blur-sm', 'bg-black/20');

        this.isInputBlockedByUI = false;

        // On demande à re-locker la souris (Seulement si on est In-Game, pas au Main Menu)
        if (id !== 'main') {
            Input.requestPointerLock();
        }

        Events.emit('ui:menu_closed', id);
        Logger.debug('UI', `Menu Fermé: ${id}`);
    }

    /**
     * Affiche/Cache le HUD en jeu
     */
    toggleHUD(show) {
        if (!this.hudInstance) return;
        show ? this.hudInstance.show() : this.hudInstance.hide();
    }

    /**
     * Crée une notification "Toast" furtive en bas/haut de l'écran avec style cyberpunk
     * @param {Object} data { title, message, type (success, warning, error, info), duration }
     */
    showNotification({ title, message, type = 'info', duration = 4000 }) {
        // Container Notifications (Le créer s'il n'existe pas)
        let notifContainer = document.getElementById('notif-container');
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.id = 'notif-container';
            notifContainer.className = 'absolute top-10 right-10 flex flex-col gap-3 z-[200] pointer-events-none items-end max-w-sm';
            this.baseLayer.appendChild(notifContainer);
        }

        // Création de la Div
        const toast = document.createElement('div');

        // Style de base (Liquid Glass)
        toast.className = `glass-panel px-5 py-4 translate-x-[120%] opacity-0 transition-all duration-500 ease-out flex items-start gap-4 border-l-4 min-w-[300px] shadow-lg relative overflow-hidden`;

        // Couleur latérale selon le type
        let bgStyle = "bg-white/5";
        let icon = "ℹ️";
        let glowClass = "";

        switch (type) {
            case 'success':
                toast.classList.add('border-l-neo-cyan');
                icon = "✓";
                glowClass = "shadow-[0_0_15px_rgba(0,243,255,0.2)]";
                break;
            case 'error':
                toast.classList.add('border-l-red-500');
                icon = "⚠";
                glowClass = "shadow-[0_0_15px_rgba(255,17,0,0.2)]";
                break;
            case 'warning':
                toast.classList.add('border-l-yellow-500');
                icon = "★";
                break;
            case 'money':
                toast.classList.add('border-l-green-400');
                icon = "€$";
                break;
        }

        toast.classList.add(glowClass);

        // Scanline effect
        const scanline = document.createElement('div');
        scanline.className = 'absolute inset-0 scanline opacity-30';
        toast.appendChild(scanline);

        // Contenu Intérieur
        const content = document.createElement('div');
        content.className = 'relative z-10 w-full';

        content.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-mono font-bold tracking-widest text-white/70">${title}</span>
                <span class="text-xs opacity-50 font-mono">${icon}</span>
            </div>
            <div class="text-sm font-sans text-white/90 leading-snug">
                ${message}
            </div>
        `;

        toast.appendChild(content);
        notifContainer.appendChild(toast);

        // Animer IN (Entrée par la droite)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.remove('translate-x-[120%]', 'opacity-0');
                toast.classList.add('translate-x-0', 'opacity-100');
            });
        });

        // Supprimer après Délai
        setTimeout(() => {
            // Animer OUT
            toast.classList.remove('translate-x-0', 'opacity-100');
            toast.classList.add('translate-x-[120%]', 'opacity-0');

            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500); // 500ms pour l'animation de sortie
        }, duration);
    }

    /**
     * Écran de boot initial
     */
    hideBootScreen() {
        const boot = document.getElementById('boot-screen');
        if (boot) {
            boot.style.opacity = '0';
            setTimeout(() => {
                boot.style.display = 'none';
            }, 1000);
        }
    }
}

export const UIManager = new UIManagerSystem();
