/**
 * mStoreApp.js
 * 
 * Main hub for the shopping experience inside mOS.
 * Mounts the UI components and parses external JSON catalogs.
 */

import './mStore_Liquid.css';
import { DigitalCart } from './DigitalCart.js';

export class mStoreApp {
    constructor(saveSystem) {
        this.saveSystem = saveSystem;
        this.cart = new DigitalCart(saveSystem);

        this.container = null;
        this.activeCatalog = null;
    }

    init(mountTargetId) {
        this.container = document.getElementById(mountTargetId);
        this.renderShell();

        // Expose to window for external triggers
        window.mStore = {
            openCatalog: this.loadCatalog.bind(this)
        };
    }

    renderShell() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="mStore-app-container layer-glass">
                <header class="mStore-header">
                    <h2>mStore</h2>
                    <div class="mStore-balance" id="mStore_balance">mCoins: 0</div>
                </header>
                <nav class="mStore-categories">
                    <button onclick="mStore.openCatalog('catalogs/car_dealership_premium.json')">Vehicles</button>
                    <button onclick="mStore.openCatalog('catalogs/tech_shop_mServices.json')">Tech & Drones</button>
                    <button onclick="mStore.openCatalog('catalogs/food_market_healthy.json')">Food & Health</button>
                </nav>
                <div class="mStore-content" id="mStore_catalog_view">
                    <div class="mStore-empty">Select a category to start shopping.</div>
                </div>
            </div>
        `;

        this.cart.updateBalanceUI();
    }

    async loadCatalog(jsonUrl) {
        try {
            const response = await fetch(jsonUrl);
            const data = await response.json();
            this.activeCatalog = data;
            this.renderCatalog(data);
        } catch (e) {
            console.error("[mStoreApp] Failed to load catalog:", e);
        }
    }

    renderCatalog(data) {
        const view = document.getElementById('mStore_catalog_view');
        if (!view) return;

        let html = `<h3 class="catalog-title">${data.storeName}</h3><div class="product-grid">`;

        data.items.forEach(item => {
            html += `
                <div class="product-card layer-glass">
                    <div class="product-icon">✦</div>
                    <h4>${item.name}</h4>
                    <p class="product-desc">${item.description}</p>
                    <div class="product-footer">
                        <span class="price">${item.price} mC</span>
                        <button class="btn-buy" id="buy_btn_${item.id}">Purchase</button>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        view.innerHTML = html;

        // Attach handlers
        data.items.forEach(item => {
            const btn = document.getElementById(`buy_btn_${item.id}`);
            if (btn) {
                btn.onclick = () => this.cart.attemptPurchase(item);
            }
        });
    }
}
