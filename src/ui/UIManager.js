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

        // Si le menu a besoin de flouter le monde derrière
        this.baseLayer.classList.add('menu-open');

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

        // Retirer l'effect de flou
        this.baseLayer.classList.remove('menu-open');

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
        let notifContainer = document.getElementById('notif-container');
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.id = 'notif-container';
            this.baseLayer.appendChild(notifContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast-notif toast-${type}`;

        // Scanline
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        scanline.style.cssText = 'position:absolute;inset:0;opacity:0.2;pointer-events:none;';
        toast.appendChild(scanline);

        // Contenu
        const content = document.createElement('div');
        content.style.cssText = 'position:relative;z-index:1;';
        content.innerHTML = `
            <span class="toast-title">${title}</span>
            <span class="toast-message">${message}</span>
        `;
        toast.appendChild(content);
        notifContainer.appendChild(toast);

        // Animer IN (prochain tick pour garantir la transition CSS)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => toast.classList.add('toast-in'));
        });

        // Supprimer après la durée demandée
        setTimeout(() => {
            toast.classList.remove('toast-in');
            toast.classList.add('toast-out');
            setTimeout(() => toast.parentNode && toast.parentNode.removeChild(toast), 500);
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
