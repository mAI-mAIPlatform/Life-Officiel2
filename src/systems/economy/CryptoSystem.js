import { Events } from '../../utils/Events.js';
import { Player } from '../../entities/player/Player.js';

/**
 * LIFE RPG - Crypto Currency Simulation
 * Bourse in-game hautement volatile pour la spéculation.
 */
class CryptoMarket {
    constructor() {
        this.coins = [
            { id: 'BTC-2077', name: 'BitCred 2077', price: 45000, history: [], volatility: 0.05, amountOwned: 0 },
            { id: 'EDG', name: 'EdgeCoin', price: 120, history: [], volatility: 0.15, amountOwned: 0 },
            { id: 'SCM', name: 'ScamDoge', price: 0.05, history: [], volatility: 0.40, amountOwned: 0 }
        ];
        // Populate initial history pseudo-data
        this.coins.forEach(c => {
            let p = c.price;
            for (let i = 0; i < 20; i++) {
                p = p * (1 + (Math.random() - 0.5) * c.volatility);
                c.history.push(p);
            }
        });
    }

    init() {
        // La crypto "tick" beaucoup plus vite que le marché physique. Chaque 10 in-game minutes.
        Events.on('time:minute_passed', (data) => {
            if (data.minutes % 10 === 0) {
                this._simulateTick();
            }
        });
    }

    _simulateTick() {
        this.coins.forEach(c => {
            // Fluctuation : Random walk
            // Un crash (Rug pull) ou un pump est possible sur les coins haute volatilité
            let pumpFactor = 0;
            if (c.id === 'SCM' && Math.random() > 0.95) {
                // 5% chance of massive pump or dump
                pumpFactor = (Math.random() > 0.5 ? 2.0 : -0.8);
            }

            const change = (Math.random() - 0.5) * c.volatility + pumpFactor;
            c.price = Math.max(0.001, c.price * (1 + change)); // Eviter prix negatif

            c.history.push(c.price);
            if (c.history.length > 50) c.history.shift(); // Garde 50 ticks
        });

        Events.emit('crypto:market_updated');
    }

    buyCoin(coinId, quantity) {
        const coin = this.coins.find(c => c.id === coinId);
        if (!coin || quantity <= 0) return false;

        const totalCost = coin.price * quantity;
        if (Player.removeMoney(totalCost)) { // Retire le cash
            coin.amountOwned += quantity;
            Events.emit('crypto:portfolio_updated');
            return true;
        }
        return false; // Pas assez s'argent
    }

    sellCoin(coinId, quantity) {
        const coin = this.coins.find(c => c.id === coinId);
        if (!coin || coin.amountOwned < quantity || quantity <= 0) return false;

        const revenue = coin.price * quantity;
        coin.amountOwned -= quantity;
        Player.addMoney(revenue); // Rajoute le cash
        Events.emit('crypto:portfolio_updated');
        return true;
    }
}

export const CryptoSystem = new CryptoMarket();
