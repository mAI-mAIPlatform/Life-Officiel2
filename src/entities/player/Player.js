import * as THREE from 'three';
import { PlayerController } from './PlayerController.js';
import { PlayerStats } from './PlayerStats.js';
import { PlayerSurvival } from './PlayerSurvival.js';
import { Inventory } from './Inventory.js';
import { Events } from '../../utils/Events.js';
import { SaveSystem } from '../../core/SaveSystem.js';

/**
 * LIFE RPG - The Player Entity
 * Sert de "God Object" pour regrouper tous les sous-systèmes du joueur 
 * (Contrôleur Physique, Stats, Survie, Inventaire).
 */
export class PlayerEntity {
    constructor() {
        this.alias = "V"; // "V" par défaut, modifiable
        this.background = "streetkid";

        // Modules
        this.controller = new PlayerController();
        this.stats = new PlayerStats();
        this.survival = new PlayerSurvival();
        this.inventory = new Inventory();

        // Données d'état général
        this.money = 0;
        this.wantedLevel = 0;
    }

    /**
     * Initialise le joueur et ses sous-modules
     */
    init(spawnPosition = new THREE.Vector3(0, 5, 0)) {
        this.controller.init(spawnPosition);
        this.stats.init();
        this.survival.init();
        this.inventory.init();

        this._setupEvents();
    }

    /**
     * Écoute les événements pertinents
     */
    _setupEvents() {
        // Gain/Perte d'argent via événement global
        Events.on('economy:add_money', (amount) => this.addMoney(amount));
        Events.on('economy:remove_money', (amount) => this.removeMoney(amount));

        // Requêtes de sauvegarde et de chargement spécifiques au composant Player
        Events.on('game:request_save', () => this.saveData());
        Events.on('game:request_load', () => this.loadData());
    }

    /**
     * Met à jour les sous-modules du joueur chaque frame
     * @param {number} dt DeltaTime
     */
    update(dt) {
        this.controller.update(dt);
        this.stats.update(dt);
        this.survival.update(dt);
        // L'inventaire n'a généralement pas besoin de tick
    }

    /**
     * Set l'identité (depuis CharacterCreator)
     */
    setIdentity(name, background, initialMoney) {
        this.alias = name;
        this.background = background;
        this.money = initialMoney;
        Events.emit('player:money_changed', this.money);
    }

    /**
     * Ajoute de l'argent et notifie l'UI
     */
    addMoney(amount) {
        if (amount <= 0) return;
        this.money += amount;
        Events.emit('player:money_changed', this.money);
        Events.emit('ui:show_notification', {
            title: 'FUNDS RECEIVED',
            message: `+€$${amount.toLocaleString()}`,
            type: 'money'
        });
    }

    /**
     * Enlève de l'argent s'il en a assez. Retourne true si succès.
     */
    removeMoney(amount) {
        if (amount <= 0) return false;
        if (this.money >= amount) {
            this.money -= amount;
            Events.emit('player:money_changed', this.money);
            return true;
        }

        Events.emit('ui:show_notification', {
            title: 'TRANSACTION FAILED',
            message: 'Insufficient Funds',
            type: 'error'
        });
        return false;
    }

    async saveData() {
        const payload = {
            alias: this.alias,
            background: this.background,
            money: this.money,
            wantedLevel: this.wantedLevel,
            position: this.controller.getPosition(),
            stats: this.stats.serialize(),
            survival: this.survival.serialize(),
            inventory: this.inventory.serialize()
        };

        await SaveSystem.saveData('player', 'current_save', payload);
    }

    async loadData() {
        const data = await SaveSystem.loadData('player', 'current_save');
        if (data) {
            this.alias = data.alias;
            this.background = data.background;
            this.money = data.money;
            this.wantedLevel = data.wantedLevel;

            this.controller.setPosition(data.position);
            this.stats.deserialize(data.stats);
            this.survival.deserialize(data.survival);
            this.inventory.deserialize(data.inventory);

            Events.emit('player:money_changed', this.money);
        }
    }
}

export const Player = new PlayerEntity();
