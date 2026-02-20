import { Events } from '../../../utils/Events.js';
import { EconomyConfig } from '../../../utils/Constants.js';

export class CryptoApp {
    constructor() {
        this.id = 'crypto';
        this.marketData = [];
        this.wallet = { 'BTE': 0, 'ETHOS': 0 };
        this.container = null;
        this.isOpen = false;
    }

    renderHTML() {
        return `
            <!-- App Header -->
            <div class="h-14 bg-[#110522] backdrop-blur-md flex items-center justify-between px-5 border-b border-neo-purple/30 z-10 transition-colors">
                <span class="text-neo-purple font-black font-sans tracking-wide">KRYPTO<span class="text-white">TRADE</span></span>
                <span class="text-xs font-mono text-neo-purple/50 px-2 py-0.5 border border-neo-purple/20 rounded">LIVE</span>
            </div>

            <!-- Body Area -->
            <div class="flex-1 overflow-y-auto w-full bg-[#0a0514] p-5 space-y-6 no-scrollbar">
                
                <!-- Portfolio Summary -->
                <div class="glass-panel border-neo-purple/20 p-5 bg-gradient-to-br from-neo-purple/10 to-transparent">
                    <h3 class="text-white/50 text-[10px] uppercase font-mono tracking-widest mb-2">Net Portfolio Value</h3>
                    <div class="flex items-end gap-2 mb-4">
                        <span class="text-white text-3xl font-mono font-bold" id="crypto-val-total">€$0</span>
                        <span class="text-green-400 text-sm font-mono mb-1 shrink-0 opacity-0 transition-opacity" id="crypto-trend">+0%</span>
                    </div>

                    <!-- Market Listings (Injecté via JS) -->
                    <div id="crypto-market-list" class="flex flex-col gap-3 mt-4">
                        <!-- Loading skeleton -->
                        <div class="h-16 rounded bg-white/5 animate-pulse"></div>
                    </div>
                </div>

                <!-- Simulation Graph Placeholder -->
                <div class="h-40 w-full rounded-lg border border-white/5 bg-black/40 flex items-end relative overflow-hidden p-2 gap-1" id="crypto-graph-container">
                    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span class="font-mono text-white/10 text-xl tracking-widest rotate-[-15deg]">CHART OFFLINE</span>
                    </div>
                </div>

            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;

        // Simuler des updates du marché cryptos (Reçoit de la part de src/systems/economy/CryptoSystem.js)
        Events.on('crypto:market_update', (data) => {
            // data format: [{ sym:'BTE', name:'BitEuro', price: 45000, trend: 1.2 }, ...]
            this.marketData = data;
            if (this.isOpen) this._renderMarket();
        });

        Events.on('crypto:wallet_update', (wallet) => {
            this.wallet = wallet;
            if (this.isOpen) this._renderMarket();
        });
    }

    onOpen() {
        this.isOpen = true;
        this._renderMarket();
    }

    onClose() {
        this.isOpen = false;
    }

    _renderMarket() {
        if (!this.marketData || this.marketData.length === 0) return;

        let totalVal = 0;

        const listHTML = this.marketData.map(coin => {
            const holdings = this.wallet[coin.sym] || 0;
            const val = holdings * coin.price;
            totalVal += val;

            const isUp = coin.trend >= 0;
            const colorClass = isUp ? 'text-green-400' : 'text-red-400';
            const bgClass = isUp ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20';

            return `
                <div class="flex flex-col bg-white/5 p-3 rounded-lg border border-white/5 hover:border-neo-purple/50 transition-colors cursor-pointer group">
                    <div class="flex justify-between items-center mb-2">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full ${bgClass} flex items-center justify-center ${colorClass} font-bold font-mono text-xs">
                                ${coin.sym[0]}
                            </div>
                            <div class="flex flex-col">
                                <span class="font-bold text-white text-sm whitespace-nowrap">${coin.sym}</span>
                                <span class="text-[10px] text-white/50">${coin.name}</span>
                            </div>
                        </div>
                        <div class="flex flex-col items-end text-right">
                            <span class="font-mono text-white text-sm">€$${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            <span class="font-mono ${colorClass} text-[10px] flex items-center gap-1">
                                ${isUp ? '▲' : '▼'} ${Math.abs(coin.trend).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    
                    ${holdings > 0 ? `
                    <div class="w-full flex justify-between bg-black/40 p-2 rounded items-center text-xs font-mono">
                        <span class="text-white/50">Owning: <span class="text-white">${holdings}</span></span>
                        <span class="text-neo-purple">€$${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>` : ''}
                </div>
            `;
        }).join('');

        const container = this.container.querySelector('#crypto-market-list');
        if (container) container.innerHTML = listHTML;

        const totalEl = this.container.querySelector('#crypto-val-total');
        if (totalEl) totalEl.textContent = `€$${totalVal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
}
