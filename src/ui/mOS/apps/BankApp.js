import { Events } from '../../../utils/Events.js';
import { EconomyConfig } from '../../../utils/Constants.js';

export class BankApp {
    constructor() {
        this.id = 'bank';
        this.userBalance = 0;
        this.transactions = [];
        this.container = null;
    }

    renderHTML() {
        return `
            <!-- App Header -->
            <div class="h-14 bg-neo-black/95 backdrop-blur-md flex items-center justify-center border-b border-[#00ffaa]/20 relative">
                <span class="text-[#00ffaa] font-sans font-bold tracking-widest uppercase">NeoBank Secure</span>
            </div>

            <!-- Scrollable Body -->
            <div class="flex-1 overflow-y-auto w-full p-6 space-y-6 no-scrollbar relative">
                <!-- Solde Principal -->
                <div class="bg-gradient-to-br from-[#00ffaa]/10 to-transparent p-6 rounded-2xl border border-[#00ffaa]/30 relative overflow-hidden">
                    <div class="absolute -right-10 -top-10 w-40 h-40 bg-[#00ffaa]/10 blur-3xl rounded-full"></div>
                    <h3 class="text-white/50 text-xs font-mono uppercase tracking-widest mb-1">Available Balance</h3>
                    <div class="flex items-baseline gap-2">
                        <span class="text-[#00ffaa] text-xl font-mono">€$</span>
                        <span id="bank-val-balance" class="text-4xl text-white font-mono font-bold tracking-tight">0</span>
                    </div>
                    <div class="mt-4 flex gap-3">
                        <button id="bank-btn-transfer" class="flex-1 bg-white/5 hover:bg-[#00ffaa]/20 border border-white/10 hover:border-[#00ffaa] text-white transition-colors rounded-lg py-2 text-sm font-medium">Transfer</button>
                        <button id="bank-btn-loan" class="flex-1 bg-white/5 hover:bg-[#00ffaa]/20 border border-white/10 hover:border-[#00ffaa] text-white transition-colors rounded-lg py-2 text-sm font-medium">Loans</button>
                    </div>
                </div>

                <!-- Recent Transactions -->
                <div>
                    <h4 class="text-white/60 text-xs font-mono uppercase tracking-widest border-b border-white/10 pb-2 mb-3">Recent Ledger</h4>
                    <div id="bank-transactions-list" class="flex flex-col gap-3">
                        <!-- Vierge à l'init -->
                        <div class="text-center py-6 text-white/30 text-sm italic font-mono">No transactions.</div>
                    </div>
                </div>
            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;

        // Listeners for in-game economy updates to refresh UI dynamically open
        Events.on('player:money_changed', (newVal) => {
            this.userBalance = newVal;
            if (this.isOpen) this._updateUI();
        });

        // Simuler un bouton de prêt (pour la démo / logique economy plus tard)
        this.container.querySelector('#bank-btn-loan').addEventListener('click', () => {
            Events.emit('economy:request_loan', { amount: 5000 });
        });
    }

    onOpen() {
        this.isOpen = true;
        this._updateUI();
    }

    onClose() {
        this.isOpen = false;
    }

    _updateUI() {
        const balEl = this.container.querySelector('#bank-val-balance');
        if (balEl) balEl.textContent = this.userBalance.toLocaleString('en-US');

        // Render transactions...
        // Format: { date: '10:45', type: 'PAYMENT', amount: -50, target: 'Burger Stand' }
        const liste = this.container.querySelector('#bank-transactions-list');
        if (this.transactions.length > 0) {
            liste.innerHTML = this.transactions.map(t => `
                <div class="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-lg">
                    <div class="flex flex-col">
                        <span class="text-sm text-white/90">${t.target}</span>
                        <span class="font-mono text-[10px] text-white/40">${t.type} • ${t.date}</span>
                    </div>
                    <span class="font-mono font-bold ${t.amount >= 0 ? 'text-[#00ffaa]' : 'text-white'}">
                        ${t.amount >= 0 ? '+' : ''}${t.amount}
                    </span>
                </div>
            `).join('');
        }
    }
}
