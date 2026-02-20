/**
 * DigitalCart.js
 * 
 * Payment processing and mCoins tracking via IndexedDB SaveSystem.
 */

export class DigitalCart {
    constructor(saveSystem) {
        this.saveSystem = saveSystem;
        this.walletKey = 'player_mCoins';
    }

    getBalance() {
        return this.saveSystem.getGlobalState(this.walletKey) || 10000; // default 10k
    }

    updateBalanceUI() {
        const balEl = document.getElementById('mStore_balance');
        if (balEl) {
            balEl.textContent = `mCoins: ${this.getBalance().toLocaleString()}`;
        }
    }

    attemptPurchase(itemData) {
        const balance = this.getBalance();

        if (balance >= itemData.price) {
            this.processPayment(itemData.price);
            this.deliverItem(itemData);
            this.showToast(`Purchased: ${itemData.name}`, 'success');
        } else {
            this.showToast('Insufficient mCoins!', 'error');
        }
    }

    processPayment(amount) {
        const newBalance = this.getBalance() - amount;
        this.saveSystem.setGlobalState(this.walletKey, newBalance);
        this.updateBalanceUI();
        console.log(`[DigitalCart] Processed payment of ${amount}. New balance: ${newBalance}`);
    }

    deliverItem(itemData) {
        // E.g., add to player inventory logic
        let inventory = this.saveSystem.getGlobalState('player_inventory') || [];
        inventory.push({ id: itemData.id, acquiredAt: Date.now() });
        this.saveSystem.setGlobalState('player_inventory', inventory);

        // Spawn item if it's a vehicle or drone immediately
        if (itemData.type === 'vehicle') {
            dispatchEvent(new CustomEvent('SpawnPurchasedVehicle', { detail: { vehicleModel: itemData.modelId } }));
        }
    }

    showToast(message, type) {
        // Connects to mOS Toast System
        console.log(`[Toast ${type.toUpperCase()}]: ${message}`);
        const toastEvt = new CustomEvent('mOS_ShowToast', {
            detail: { message: message, type: type }
        });
        window.dispatchEvent(toastEvt);
    }
}
