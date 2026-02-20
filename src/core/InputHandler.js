import { InputBindings } from '../utils/Constants.js';
import { Events } from '../utils/Events.js';

/**
 * LIFE RPG - Input Handler
 * Gère de manière unifiée le Clavier, la Souris et la Manette de jeu (Gamepad API).
 * Traduit les touches brutes en "Actions" (Avancer, Tirer, Sauter...) pour que le CharacterController
 * ne se soucie pas du périphérique utilisé.
 */
class InputManager {
    constructor() {
        this.keys = new Map();
        this.buttons = new Map(); // Gamepad buttons
        this.axes = new Map();    // Gamepad axes

        // Souris
        this.mouse = {
            x: 0,
            y: 0,
            movementX: 0,
            movementY: 0,
            locked: false,
            leftDown: false,
            rightDown: false,
            scroll: 0
        };

        // Actions combinées (Clavier OU Manette)
        this.actions = {
            moveX: 0, // -1 (Gauche) à 1 (Droite)
            moveY: 0, // -1 (Reculer) à 1 (Avancer)
            lookX: 0,
            lookY: 0,
            jump: false,
            sprint: false,
            crouch: false,
            interact: false,
            reload: false,
            shoot: false,
            aim: false
        };

        this.gamepadIndex = null;
        this.isGamepadActive = false;

        this.targetCanvas = null;
    }

    init(canvasId = 'game-canvas-container') {
        const container = document.getElementById(canvasId);
        if (container) {
            this.targetCanvas = container.querySelector('canvas') || window;
        } else {
            this.targetCanvas = window;
        }

        this._setupKeyboard();
        this._setupMouse();
        this._setupGamepad();
    }

    _setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys.get(e.code)) {
                this.keys.set(e.code, true);
                this._checkActionJustPressed(e.code);
            }
            this.isGamepadActive = false;
        });

        window.addEventListener('keyup', (e) => {
            this.keys.set(e.code, false);
            this.isGamepadActive = false;
        });
    }

    _setupMouse() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            if (this.mouse.locked) {
                this.mouse.movementX = e.movementX;
                this.mouse.movementY = e.movementY;
            }
            this.isGamepadActive = false;
        });

        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.leftDown = true;
            if (e.button === 2) this.mouse.rightDown = true;
            this.isGamepadActive = false;
        });

        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.leftDown = false;
            if (e.button === 2) this.mouse.rightDown = false;
            this.isGamepadActive = false;
        });

        document.addEventListener('wheel', (e) => {
            this.mouse.scroll = Math.sign(e.deltaY);
        }, { passive: true });

        // Pointer Lock (FPS/TPS Camera)
        document.addEventListener('pointerlockchange', () => {
            this.mouse.locked = (document.pointerLockElement === this.targetCanvas);
            Events.emit('input:pointerlock', this.mouse.locked);
        });
    }

    _setupGamepad() {
        window.addEventListener('gamepadconnected', (e) => {
            this.gamepadIndex = e.gamepad.index;
            console.log(`Gamepad connecté: ${e.gamepad.id}`);
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            if (this.gamepadIndex === e.gamepad.index) {
                this.gamepadIndex = null;
                this.isGamepadActive = false;
            }
        });
    }

    /**
     * Vérifie si l'action vient tout juste d'être déclenchée
     */
    _checkActionJustPressed(code) {
        // Exemples d'événements "one-shot"
        const bind = InputBindings.KEYBOARD;
        if (bind.JUMP.includes(code)) Events.emit('input:action_jump');
        if (bind.INTERACT.includes(code)) Events.emit('input:action_interact');
        if (bind.RELOAD.includes(code)) Events.emit('input:action_reload');
        if (bind.OPEN_MOS.includes(code)) Events.emit('input:action_mos');
        if (bind.INVENTORY.includes(code)) Events.emit('input:action_inventory');
        if (bind.SWITCH_CAMERA.includes(code)) Events.emit('input:action_camera');
        if (bind.PAUSE.includes(code)) Events.emit('input:action_pause');
    }

    /**
     * Helper pour savoir si n'importe quelle touche d'un array est pressée
     */
    _isAnyKeyPressed(codesArray) {
        if (!codesArray) return false;
        for (let i = 0; i < codesArray.length; i++) {
            if (this.keys.get(codesArray[i])) return true;
        }
        return false;
    }

    /**
     * Met à jour l'état de la manette (appelé par le GameLoop chaque frame fixe)
     */
    _updateGamepad() {
        if (this.gamepadIndex === null) return;

        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return;

        // Note: Deadzones basiques
        const applyDeadzone = (val, threshold = 0.15) => (Math.abs(val) > threshold ? val : 0);

        // Si input joysticks ou trigger détecté, switch au mode Gamepad
        if (!this.isGamepadActive) {
            if (gamepad.axes.some(a => Math.abs(a) > 0.2) || gamepad.buttons.some(b => b.pressed)) {
                this.isGamepadActive = true;
            }
        }

        if (this.isGamepadActive) {
            // Analogiques
            this.axes.set('LeftStickX', applyDeadzone(gamepad.axes[0]));
            this.axes.set('LeftStickY', applyDeadzone(-gamepad.axes[1])); // Inversé classique Y
            this.axes.set('RightStickX', applyDeadzone(gamepad.axes[2]));
            this.axes.set('RightStickY', applyDeadzone(-gamepad.axes[3]));

            // Triggers L2/R2 (Sur XInput, ils sont parfois sur des axes séparés, ou buttons.value)
            this.axes.set('LeftTrigger', gamepad.buttons[6]?.value || 0);
            this.axes.set('RightTrigger', gamepad.buttons[7]?.value || 0);

            // Boutons (Mappage XInput standard)
            const b = gamepad.buttons;
            const newButtons = new Map();
            newButtons.set('ButtonS', b[0]?.pressed); // A / Cross
            newButtons.set('ButtonE', b[1]?.pressed); // B / Circle
            newButtons.set('ButtonW', b[2]?.pressed); // X / Square
            newButtons.set('ButtonN', b[3]?.pressed); // Y / Triangle

            // Gérer les "Just Pressed" de Gamepad
            if (!this.buttons.get('ButtonS') && newButtons.get('ButtonS')) Events.emit('input:action_jump');
            if (!this.buttons.get('ButtonW') && newButtons.get('ButtonW')) Events.emit('input:action_interact');
            if (!this.buttons.get('ButtonN') && newButtons.get('ButtonN')) Events.emit('input:action_reload');
            // Mettre à jour dict final
            this.buttons = newButtons;
            this.buttons.set('LeftStick', b[10]?.pressed); // L3
        }
    }

    /**
     * Appelé par le Game Loop (FixedUpdate ou Update)
     * Synthèse Keyboard/Souris + Gamepad dans l'objet commun "actions"
     */
    update() {
        this._updateGamepad();

        // Remise à 0 des axes
        let moveX = 0;
        let moveY = 0;
        let lookX = 0;
        let lookY = 0;

        const kBind = InputBindings.KEYBOARD;

        if (this.isGamepadActive) {
            moveX = this.axes.get('LeftStickX') || 0;
            moveY = this.axes.get('LeftStickY') || 0;
            lookX = this.axes.get('RightStickX') || 0;
            lookY = this.axes.get('RightStickY') || 0;

            this.actions.jump = this.buttons.get('ButtonS');
            this.actions.crouch = this.buttons.get('ButtonE');
            this.actions.sprint = this.buttons.get('LeftStick');
            this.actions.aim = (this.axes.get('LeftTrigger') > 0.5);
            this.actions.shoot = (this.axes.get('RightTrigger') > 0.5);
        } else {
            // Clavier
            if (this._isAnyKeyPressed(kBind.MOVE_FORWARD)) moveY += 1;
            if (this._isAnyKeyPressed(kBind.MOVE_BACKWARD)) moveY -= 1;
            if (this._isAnyKeyPressed(kBind.MOVE_LEFT)) moveX -= 1;
            if (this._isAnyKeyPressed(kBind.MOVE_RIGHT)) moveX += 1;

            // Souris : on consomme le mouse movement
            if (this.mouse.locked) {
                lookX = this.mouse.movementX;
                lookY = this.mouse.movementY;
                // Important : on reset le delta de la frame précédente
                this.mouse.movementX = 0;
                this.mouse.movementY = 0;
            }

            this.actions.jump = this._isAnyKeyPressed(kBind.JUMP);
            this.actions.crouch = this._isAnyKeyPressed(kBind.CROUCH);
            this.actions.sprint = this._isAnyKeyPressed(kBind.SPRINT);
            this.actions.aim = this.mouse.rightDown;
            this.actions.shoot = this.mouse.leftDown;
        }

        // Normalisation du vecteur mouvement Clavier pour ne pas bouger plus vite en diagonale
        if (!this.isGamepadActive && (moveX !== 0 || moveY !== 0)) {
            const length = Math.sqrt(moveX * moveX + moveY * moveY);
            moveX /= length;
            moveY /= length;
        }

        this.actions.moveX = moveX;
        this.actions.moveY = moveY;
        this.actions.lookX = lookX;
        this.actions.lookY = lookY;

        // Reset single-frame inputs
        this.mouse.scroll = 0;
    }

    /**
     * Tente de verrouiller le curseur de souris pour FPS/TPS control
     */
    requestPointerLock() {
        if (!this.mouse.locked && this.targetCanvas && this.targetCanvas.requestPointerLock) {
            this.targetCanvas.requestPointerLock();
        }
    }

    /**
     * Dévérouille (par ex: ouverture de menu M-OS)
     */
    exitPointerLock() {
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }
}

export const Input = new InputManager();
