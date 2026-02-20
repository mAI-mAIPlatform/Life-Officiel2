import { Events } from '../../../utils/Events.js';

export class JobApp {
    constructor() {
        this.id = 'jobs';
        this.container = null;
        this.isOpen = false;

        // Mock data. Sera connecté au système de quêtes global.
        this.activeJobs = [
            { id: 'mq1', title: 'The Heist', client: 'Dexter D.', status: 'In Progress', tier: 'S', payout: 50000, desc: 'Steal the experimental bio-chip from Arasaka Tower.' },
            { id: 'sq1', title: 'Cyberpsycho Sighting', client: 'Regina J.', status: 'Investigate', tier: 'C', payout: 1500, desc: 'Gunshots heard near Watson docks. Investigate non-lethally if possible.' }
        ];
    }

    renderHTML() {
        return `
            <div class="h-14 bg-[#eeaa00] flex justify-center items-center font-black tracking-widest text-black text-sm uppercase">
                GIGS & JOBS
            </div>
            <div class="flex-1 overflow-y-auto w-full bg-[#111] p-4 space-y-4 no-scrollbar">
                
                <h3 class="text-xs uppercase font-bold text-[#eeaa00] border-b border-[#eeaa00]/30 pb-2">Active Contracts</h3>
                
                <div id="jobs-list" class="flex flex-col gap-3">
                    <!-- Géneré par JS -->
                </div>

                <button class="w-full py-4 mt-6 border-2 border-dashed border-white/20 text-white/40 font-mono text-xs uppercase tracking-widest hover:border-white/50 hover:text-white transition-colors cursor-pointer rounded-lg bg-white/5">
                    FIND NEW GIGS NEARBY
                </button>
            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;
    }

    onOpen() {
        this.isOpen = true;
        this._renderJobs();
    }

    onClose() {
        this.isOpen = false;
    }

    _renderJobs() {
        const listEl = this.container.querySelector('#jobs-list');
        listEl.innerHTML = this.activeJobs.map(job => `
            <div class="bg-[#222] border-l-4 border-[#eeaa00] p-3 rounded-r-lg shadow-lg relative overflow-hidden group cursor-pointer hover:bg-[#2a2a2a] transition-colors">
                <div class="flex justify-between items-start mb-2 relative z-10">
                    <h4 class="font-bold text-white text-sm max-w-[70%] leading-tight">${job.title}</h4>
                    <span class="bg-[#eeaa00]/20 text-[#eeaa00] text-[10px] font-bold px-2 py-0.5 rounded">TIER ${job.tier}</span>
                </div>
                <p class="text-[10px] text-white/50 line-clamp-2 mb-3 relative z-10">${job.desc}</p>
                <div class="flex justify-between items-center text-[10px] uppercase font-mono relative z-10">
                    <span class="text-white/40">From: ${job.client}</span>
                    <span class="text-green-400 font-bold">€$${job.payout.toLocaleString()}</span>
                </div>
                <!-- Track Button Overlay (Apparait au hover) -->
                <div class="absolute inset-0 bg-[#eeaa00] translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-10 transition-all duration-300 pointer-events-none"></div>
            </div>
        `).join('');
    }
}
