import { Events } from '../../../utils/Events.js';

export class MapsApp {
    constructor() {
        this.id = 'maps';
        this.container = null;
        this.isOpen = false;
        // La vraie implémentation map WebGL 2D ou Canvas sera greffée ici plus tard
        // Pour l'instant, c'est une Grid UI stylisée
    }

    renderHTML() {
        return `
            <!-- Full Height App because Map -->
            <div class="w-full h-full relative overflow-hidden bg-neo-black">
                
                <!-- Map Layer (Grid Placeholder for now) -->
                <div id="maps-canvas" class="absolute inset-0 bg-[#0a1128]" style="background-image: linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px); background-size: 50px 50px;">
                    
                    <!-- Player Dot -->
                    <div id="maps-player-dot" class="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff] -translate-x-1/2 -translate-y-1/2 z-20">
                        <div class="absolute inset-0 bg-white rounded-full animate-ping opacity-50"></div>
                        <!-- Orientation Cone -->
                        <div class="absolute top-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[8px] border-l-transparent border-r-transparent border-b-white/50"></div>
                    </div>
                    
                    <!-- POI Example (Point of Interest) -->
                    <div class="absolute top-1/3 left-1/4 flex flex-col items-center group cursor-pointer">
                        <div class="w-3 h-3 bg-[#ff00aa] rotate-45 border border-white"></div>
                        <span class="text-[9px] font-mono text-[#ff00aa] bg-black/80 px-1 mt-1 rounded opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">Ripperdoc</span>
                    </div>

                </div>

                <!-- Floating UI Elements -->
                
                <!-- Navbar Transparente -->
                <div class="absolute top-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent flex items-start justify-between p-4 z-40 pointer-events-none">
                    <div class="pointer-events-auto bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 text-white text-xs font-bold shadow-lg flex-1 flex items-center">
                        <span class="opacity-50 mr-2">📍</span> <span id="maps-zone-name">Financial District</span>
                    </div>
                </div>

                <!-- GPS Input / Routing (Bottom) -->
                <div class="absolute bottom-6 left-4 right-4 z-40">
                    <div class="glass-panel p-3 bg-black/60 border border-neo-cyan/30 flex items-center gap-3">
                        <button class="w-10 h-10 rounded bg-neo-cyan/20 text-neo-cyan flex justify-center items-center font-bold">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l7 7 7-7"/></svg>
                        </button>
                        <div class="flex-1 flex flex-col">
                            <span class="text-[10px] text-neo-cyan font-mono uppercase">Set Route Target</span>
                            <span class="text-white/60 text-xs italic">Awaiting coordinates...</span>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;

        Events.on('player:moved', (pos) => {
            if (this.isOpen) {
                // Mettre à jour le mini-plan interne via les coordonnées X/Z transformées (à implémenter via MapSystem)
            }
        });

        Events.on('world:zone_entered', (zoneName) => {
            const zEl = this.container.querySelector('#maps-zone-name');
            if (zEl) zEl.textContent = zoneName;
        });
    }

    onOpen() {
        this.isOpen = true;
    }

    onClose() {
        this.isOpen = false;
    }
}
