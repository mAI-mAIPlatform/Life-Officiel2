import { Events } from '../../utils/Events.js';
let ItemsDB = [];
fetch('/src/data/items.json').then(r => r.json()).then(data => { ItemsDB = data; }).catch(() => { });

export class Inventory {
    constructor() {
        // maxWeight en KG (Influencé par la FOR (Strength) dans le futur)
        this.maxWeight = 30.0;
        this.currentWeight = 0.0;

        // tableau de stacks (id_db, qty)
        this.items = [];

        // Arme en main (Equiped)
        this.weapons = [null, null, null]; // Holsters (Primary, Secondary, Melee)
        this.activeWeaponIndex = -1;
    }

    init() { }

    /**
     * Tente d'ajouter un item depuis l'id_db. Renvoie true si succès, false si trop lourd.
     */
    addItem(itemId, amount = 1) {
        const itemInfo = ItemsDB.find(i => i.id === itemId);
        if (!itemInfo) return false;

        const weightAdded = itemInfo.weight * amount;
        if (this.currentWeight + weightAdded > this.maxWeight) {
            Events.emit('ui:show_notification', { title: "INVENTORY", message: "Too heavy to carry!", type: "error" });
            return false;
        }

        // Check si on a déjà une stack de ce type (sauf armes, qu'on stackent modérément)
        const existing = this.items.find(i => i.id === itemId);
        if (existing && itemInfo.category !== "Weapon") {
            existing.qty += amount;
        } else {
            this.items.push({ id: itemId, qty: amount });
        }

        this._recalcWeight();
        Events.emit('inventory:added', { id: itemId, amount: amount });
        return true;
    }

    removeItem(itemId, amount = 1) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index > -1) {
            this.items[index].qty -= amount;
            if (this.items[index].qty <= 0) {
                this.items.splice(index, 1);
            }
            this._recalcWeight();
            Events.emit('inventory:removed', { id: itemId, amount: amount });
            return true;
        }
        return false;
    }

    _recalcWeight() {
        this.currentWeight = 0;
        this.items.forEach(i => {
            const itemInfo = ItemsDB.find(db => db.id === i.id);
            if (itemInfo) {
                this.currentWeight += itemInfo.weight * i.qty;
            }
        });
    }

    // --- Weapon Equip Logic ---

    equipWeapon(inventoryIndex, slotIndex) {
        // Retire l'arme de l'inventaire principal -> Met dans le holster
        const item = this.items[inventoryIndex];
        const itemInfo = ItemsDB.find(db => db.id === item.id);

        if (itemInfo && itemInfo.category === 'Weapon') {
            this.weapons[slotIndex] = item;
            // Supprime de l'inventaire bag
            this.items.splice(inventoryIndex, 1);
        }
    }

    drawWeapon(slotIndex) {
        if (this.weapons[slotIndex]) {
            this.activeWeaponIndex = slotIndex;
            const wInfo = ItemsDB.find(db => db.id === this.weapons[slotIndex].id);
            // Simule l'événement pour le HUD
            Events.emit('player:weapon_equipped', {
                name: wInfo.name,
                clip: 12, // TODO: Load saved ammo
                reserve: 48
            });
        }
    }

    holsterWeapon() {
        this.activeWeaponIndex = -1;
        Events.emit('player:weapon_equipped', null);
    }

    serialize() {
        return {
            maxWeight: this.maxWeight,
            items: this.items,
            weapons: this.weapons
        };
    }

    deserialize(data) {
        if (!data) return;
        this.maxWeight = data.maxWeight || 30.0;
        this.items = data.items || [];
        this.weapons = data.weapons || [null, null, null];
        this._recalcWeight();
    }
}
