import { Events } from '../../../utils/Events.js';

export class DarkWebApp {
    constructor() {
        this.id = 'darkweb';
        this.container = null;
        this.isOpen = false;
    }

    renderHTML() {
        return `
            <div class="h-14 bg-black border-b border-red-900 flex justify-center items-center font-black tracking-widest text-red-700 text-sm uppercase glitch-text" data-text="ONION ROUTER">
                ONION ROUTER
            </div>
            <div class="flex-1 overflow-y-auto w-full bg-black p-4 space-y-6 no-scrollbar text-red-500 font-mono relative">
                
                <!-- Overlay Scanline -->
                <div class="absolute inset-0 scanline opacity-20 pointer-events-none"></div>

                <div class="text-center mb-6">
                    <span class="text-xs uppercase opacity-50 block mb-1">Encrypted Connection</span>
                    <span class="text-[10px] break-all opacity-30">cxg5j6f8z9v2b4k1.onion/marketplace</span>
                </div>

                <!-- Black Market Items -->
                <div class="space-y-4">
                    
                    <div class="border border-red-900/50 bg-red-900/10 p-3 hover:bg-red-900/30 cursor-pointer">
                        <div class="flex justify-between items-start mb-2">
                            <span class="font-bold">Military ICE-Breaker v3</span>
                            <span class="line-through text-red-500/50">€$25k</span>
                            <span class="text-white font-bold">€$18,000</span>
                        </div>
                        <p class="text-[10px] text-red-400/60 leading-tight">Bypasses Tier 4 corporate firewalls. Undetectable by standard tracing ICE. Stock: 1.</p>
                        <div class="mt-3 flex justify-between items-center">
                            <span class="text-[9px] text-red-500/30 uppercase">Vendor: ShadowBroker_99</span>
                            <button class="bg-red-800 text-black px-3 py-1 text-[10px] font-bold hover:bg-red-500 transition-colors uppercase">Acquire</button>
                        </div>
                    </div>

                    <div class="border border-red-900/50 bg-red-900/10 p-3 hover:bg-red-900/30 cursor-pointer">
                        <div class="flex justify-between items-start mb-2">
                            <span class="font-bold">Encrypted Hit Contract</span>
                        </div>
                        <p class="text-[10px] text-red-400/60 leading-tight mb-2">Target location drops encrypted to buyer. Zero tracing.</p>
                        <div class="text-white font-bold text-sm mb-3 text-right">€$5,000 BTE (Crypto Only)</div>
                        <div class="mt-1 flex justify-between items-center">
                            <span class="text-[9px] text-red-500/30 uppercase">Vendor: Anonymous</span>
                            <button class="bg-red-800 text-black px-3 py-1 text-[10px] font-bold hover:bg-red-500 transition-colors uppercase">Buy Intel</button>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;
    }

    onOpen() {
        this.isOpen = true;
    }

    onClose() {
        this.isOpen = false;
    }
}
