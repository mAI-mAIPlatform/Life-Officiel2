import { UIConfig } from '../../../utils/Constants.js';

export class SettingsApp {
    constructor() {
        this.id = 'mos_settings';
        this.container = null;
        this.isOpen = false;
    }

    renderHTML() {
        return `
            <div class="h-14 bg-zinc-900 border-b border-zinc-700 flex justify-center items-center font-bold text-white text-sm">
                Settings
            </div>
            <div class="flex-1 overflow-y-auto w-full bg-black p-4 space-y-6 no-scrollbar text-white">
                
                <!-- Display Section -->
                <div>
                    <h3 class="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 ml-1">Display</h3>
                    <div class="bg-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-800 border border-zinc-800">
                        <div class="flex justify-between items-center p-3 text-sm">
                            <span>Brightness</span>
                            <span class="text-zinc-500">Auto</span>
                        </div>
                        <div class="flex justify-between items-center p-3 text-sm">
                            <span>Color Theme</span>
                            <div class="w-4 h-4 rounded-full bg-neo-cyan border border-white"></div>
                        </div>
                    </div>
                </div>

                <!-- Network Section -->
                <div>
                    <h3 class="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 ml-1">Network</h3>
                    <div class="bg-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-800 border border-zinc-800">
                        <div class="flex justify-between items-center p-3 text-sm">
                            <span>NetLink Status</span>
                            <span class="text-green-400 font-mono text-xs">Connected (5G)</span>
                        </div>
                        <div class="flex justify-between items-center p-3 text-sm">
                            <span>Anonymous Mode</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer">
                                <div class="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- System Info Section -->
                <div>
                    <h3 class="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2 ml-1">System</h3>
                    <div class="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 p-4 text-center">
                        <div class="w-12 h-12 mx-auto bg-zinc-800 rounded-2xl flex items-center justify-center mb-2">
                            <span class="text-2xl">📱</span>
                        </div>
                        <div class="font-bold text-sm">Neon OS v4.1.0</div>
                        <div class="text-[10px] text-zinc-500 mt-1 font-mono">Kernel Build: 4120.9A</div>
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
