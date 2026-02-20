import { Events } from '../../utils/Events.js';
import { Player } from '../../entities/player/Player.js';
import PropertiesDB from '../../data/properties.json' with { type: 'json' };

/**
 * LIFE RPG - Property Manager
 * Gère l'achat, la vente et l'accès aux appartements / business du joueur.
 */
class RealEstateManager {
    constructor() {
        this.ownedProperties = [];
        this.activePropertyId = null; // Propriété où le joueur est actuellement
    }

    init() {
        // En vrai: Charger depuis la sauvegarde
        // Par defaut, le background 'streetkid' donne un taudis dans slum?
        if (Player.background === 'streetkid') {
            const starter = PropertiesDB.find(p => p.id === 'apt_slum_01');
            if (starter) this.ownedProperties.push(starter.id);
        }
    }

    getOwned() {
        return this.ownedProperties.map(id => PropertiesDB.find(p => p.id === id));
    }

    getAvailableToBuy() {
        return PropertiesDB.filter(p => !this.ownedProperties.includes(p.id));
    }

    buyProperty(propertyId) {
        if (this.ownedProperties.includes(propertyId)) return false;

        const prop = PropertiesDB.find(p => p.id === propertyId);
        if (!prop) return false;

        if (Player.removeMoney(prop.price)) {
            this.ownedProperties.push(propertyId);
            Events.emit('ui:show_notification', { title: "REAL ESTATE", message: `Purchased ${prop.name} for €$${prop.price}`, type: "success" });
            Events.emit('property:updated');
            return true;
        } else {
            Events.emit('ui:show_notification', { title: "REAL ESTATE", message: `Insufficient funds.`, type: "error" });
        }
        return false;
    }

    sellProperty(propertyId) {
        const index = this.ownedProperties.indexOf(propertyId);
        if (index > -1) {
            const prop = PropertiesDB.find(p => p.id === propertyId);
            const sellPrice = Math.floor(prop.price * 0.7); // On perd 30% a la revente
            Player.addMoney(sellPrice);
            this.ownedProperties.splice(index, 1);

            Events.emit('ui:show_notification', { title: "REAL ESTATE", message: `Sold ${prop.name} for €$${sellPrice}`, type: "money" });
            Events.emit('property:updated');
            return true;
        }
        return false;
    }

    /**
     * Appelé quand le joueur passe la porte de l'appart.
     * Déclenche le rendu de l'intérieur et le HousingEditor.
     */
    enterProperty(propertyId) {
        if (this.ownedProperties.includes(propertyId)) {
            this.activePropertyId = propertyId;
            Events.emit('property:entered', propertyId);
            // TODO: Charger la carte interieure et decharger l'open world
        } else {
            Events.emit('ui:show_notification', { title: "ACCESS DENIED", message: `You do not own this property.`, type: "error" });
        }
    }

    leaveProperty() {
        this.activePropertyId = null;
        Events.emit('property:left');
        // TODO: Recharger Open World a la position de la porte
    }
}

export const PropertyManager = new RealEstateManager();
