import { Events } from '../../../utils/Events.js';

export class PropertyApp {
    constructor() {
        this.id = 'properties';
        this.container = null;
        this.isOpen = false;

        this.properties = [
            { id: 'apt_v', name: "Megabuilding H10 Apt", type: 'Apartment', status: 'Owned', val: 0, rent: 0 },
            { id: 'apt_glen', name: "The Glen Loft", type: 'Apartment', status: 'For Sale', val: 80000, rent: 1500 },
            { id: 'biz_club', name: "Neon Nights Club", type: 'Business', status: 'For Sale', val: 500000, rent: -5000 } // rent < 0 means income
        ];
    }

    renderHTML() {
        return `
            <div class="h-14 bg-blue-900/40 backdrop-blur-md flex justify-center items-center font-bold tracking-widest text-[#00f3ff] text-sm uppercase border-b border-[#00f3ff]/20">
                EZ-ESTATE
            </div>
            <div class="flex-1 overflow-y-auto w-full bg-gradient-to-b from-[#050a15] to-[#010205] p-4 space-y-4 no-scrollbar">
                
                <h3 class="text-[10px] text-white/50 font-mono uppercase tracking-widest border-b border-white/10 pb-1">My Properties</h3>
                <div id="prop-owned-list" class="space-y-2 mb-6"></div>

                <h3 class="text-[10px] text-white/50 font-mono uppercase tracking-widest border-b border-white/10 pb-1 mt-4">Market Listings</h3>
                <div id="prop-market-list" class="space-y-3"></div>

            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;
    }

    onOpen() {
        this.isOpen = true;
        this._renderLists();
    }

    onClose() {
        this.isOpen = false;
    }

    _renderLists() {
        const ownedContainer = this.container.querySelector('#prop-owned-list');
        const marketContainer = this.container.querySelector('#prop-market-list');

        const owned = this.properties.filter(p => p.status === 'Owned');
        const market = this.properties.filter(p => p.status === 'For Sale');

        ownedContainer.innerHTML = owned.length ? owned.map(p => this._buildCard(p)).join('') : '<div class="text-[10px] text-white/30 italic">No properties owned.</div>';
        marketContainer.innerHTML = market.map(p => this._buildCard(p)).join('');
    }

    _buildCard(p) {
        const isOwned = p.status === 'Owned';
        const incomeHtml = p.rent < 0
            ? `<span class="text-green-400 font-mono text-[10px]">INCOME: +€$${Math.abs(p.rent)}/day</span>`
            : (p.rent > 0 ? `<span class="text-red-400 font-mono text-[10px]">RENT: -€$${Math.abs(p.rent)}/day</span>` : '');

        return `
            <div class="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                <div class="flex justify-between items-start mb-1">
                    <span class="font-bold text-white text-sm group-hover:text-[#00f3ff] transition-colors">${p.name}</span>
                    <span class="text-[9px] bg-black/50 px-2 py-0.5 rounded text-white/70 border border-white/10">${p.type}</span>
                </div>
                <div class="flex justify-between items-end mt-3">
                    <div class="flex flex-col">
                        ${incomeHtml}
                    </div>
                    ${!isOwned
                ? `<span class="bg-[#00f3ff]/20 text-[#00f3ff] text-xs font-mono font-bold px-2 py-1 rounded">Buy: €$${p.val.toLocaleString()}</span>`
                : `<span class="text-white/40 text-[10px] uppercase">Set Waypoint</span>`
            }
                </div>
            </div>
        `;
    }
}
