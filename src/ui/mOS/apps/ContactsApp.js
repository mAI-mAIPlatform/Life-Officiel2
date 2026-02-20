import { Events } from '../../../utils/Events.js';

export class ContactsApp {
    constructor() {
        this.id = 'contacts';
        this.container = null;
        this.isOpen = false;

        // Données mockées pour l'initialisation (Seront remplacées par SaveSystem/QuestManager)
        this.contacts = [
            { id: 'dex', name: 'Dexter DeShawn', status: 'Offline', affinity: 40, avatar: '👤' },
            { id: 'judy', name: 'Judy Alvarez', status: 'Online', affinity: 85, avatar: '👩🏻‍💻' },
            { id: 'ncpd', name: 'NCPD Dispatch', status: 'Online', affinity: 10, avatar: '🚓' },
            { id: 'fixer1', name: 'Wakako Okada', status: 'Busy', affinity: 60, avatar: '🐉' }
        ];
    }

    renderHTML() {
        return `
            <div class="h-14 bg-white/5 backdrop-blur-md flex justify-center items-center font-bold tracking-widest text-white border-b border-white/5 text-sm uppercase">
                Directory
            </div>
            <div class="p-4">
                <input type="text" placeholder="Search contact..." class="w-full bg-white/10 border border-white/10 p-2 rounded-lg text-xs outline-none focus:border-neo-cyan text-white transition-colors">
            </div>
            <div class="flex-1 overflow-y-auto w-full px-4 pb-6 space-y-2 no-scrollbar" id="contacts-list">
                <!-- Généré dynamiquement -->
            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;
    }

    onOpen() {
        this.isOpen = true;
        this._renderContacts();
    }

    onClose() {
        this.isOpen = false;
    }

    _renderContacts() {
        const listEl = this.container.querySelector('#contacts-list');
        listEl.innerHTML = this.contacts.map(c => {
            let statusColor = c.status === 'Online' ? 'bg-green-500' : (c.status === 'Busy' ? 'bg-yellow-500' : 'bg-gray-500');
            return `
                <div class="bg-black/40 border border-white/5 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors group">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xl relative border border-white/10 border-t-white/30">
                            ${c.avatar}
                            <div class="absolute bottom-0 right-0 w-2.5 h-2.5 ${statusColor} rounded-full border border-black"></div>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-sm font-bold text-white/90 group-hover:text-white">${c.name}</span>
                            <span class="text-[10px] text-white/40">Affinity: ${c.affinity}%</span>
                        </div>
                    </div>
                    <!-- Boutons Actions -->
                    <div class="flex gap-2">
                        <button class="w-8 h-8 rounded-full bg-neo-cyan/10 text-neo-cyan flex justify-center items-center hover:bg-neo-cyan hover:text-black transition-colors" title="Message">✉</button>
                        <button class="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex justify-center items-center hover:bg-green-500 hover:text-black transition-colors" title="Call">📞</button>
                    </div>
                </div>
            `;
        }).join('');
    }
}
