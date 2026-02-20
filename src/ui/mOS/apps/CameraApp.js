import { Events } from '../../../utils/Events.js';
import { Engine } from '../../../core/Engine.js';

export class CameraApp {
    constructor() {
        this.id = 'camera';
        this.container = null;
        this.isOpen = false;
    }

    renderHTML() {
        // En vrai, cette app retire massivement le fond noir, et laisse simplement "voir" le canvas WebGL en dessous
        // Mais y ajoute un réticule UI d'appareil photo.
        return `
            <div class="absolute inset-0 w-full h-full flex flex-col justify-between pointer-events-none">
                <!-- Top UI Camera -->
                <div class="h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-4 z-10 text-white font-mono text-xs pointer-events-auto">
                    <span>⚡ Auto</span>
                    <span class="bg-red-500 px-2 rounded-full animate-pulse">REC</span>
                    <span>HDR ON</span>
                </div>
                
                <!-- Central Focus Bracket -->
                <div class="absolute inset-0 flex items-center justify-center z-0">
                    <div class="w-32 h-32 border border-white/40 flex justify-between items-center opacity-50 relative">
                        <div class="absolute top-1/2 left-1/2 w-1 h-1 bg-white -translate-x-1/2 -translate-y-1/2"></div>
                        <!-- Bracket Corners -->
                        <div class="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-neo-cyan"></div>
                        <div class="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-neo-cyan"></div>
                        <div class="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-neo-cyan"></div>
                        <div class="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-neo-cyan"></div>
                    </div>
                </div>

                <!-- Bottom UI Camera -->
                <div class="h-24 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-center gap-8 pb-4 z-10 pointer-events-auto">
                    <button class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 border border-white/50 backdrop-blur aspect-square"></button>
                    <!-- Shutter Button -->
                    <button id="camera-btn-shutter" class="w-16 h-16 rounded-full bg-white border-4 border-gray-300 hover:scale-95 transition-transform flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]"></button>
                    <button class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 border border-white/50 backdrop-blur aspect-square overflow-hidden flex items-center justify-center text-xs">🗂️</button>
                </div>
                
                <!-- Screen Flash Effect Container -->
                <div id="camera-flash" class="absolute inset-0 bg-white opacity-0 pointer-events-none z-[100]"></div>
            </div>
        `;
    }

    onMount(wrapperDOM) {
        this.container = wrapperDOM;

        this.container.querySelector('#camera-btn-shutter').addEventListener('click', () => {
            this._takePicture();
        });
    }

    onOpen() {
        this.isOpen = true;

        // Magie : Rendre le container de base du mOS transparent pour cette app !
        const mosScreen = document.getElementById('mos-screen');
        if (mosScreen) {
            mosScreen.classList.remove('bg-[url(\'/textures/ui/mos_bg.jpg\')]');
            mosScreen.classList.add('bg-transparent');
        }
    }

    onClose() {
        this.isOpen = false;
        const mosScreen = document.getElementById('mos-screen');
        if (mosScreen) {
            mosScreen.classList.add('bg-[url(\'/textures/ui/mos_bg.jpg\')]');
            mosScreen.classList.remove('bg-transparent');
        }
    }

    _takePicture() {
        Events.emit('ui:click_sound'); // Devrait être un son de shutter Camera

        // 1. Jouer effet flash blanc CSS
        const flash = this.container.querySelector('#camera-flash');
        flash.classList.remove('opacity-0', 'transition-opacity');
        flash.classList.add('opacity-100');

        requestAnimationFrame(() => {
            flash.classList.add('transition-opacity', 'duration-500');
            flash.classList.remove('opacity-100');
            flash.classList.add('opacity-0');
        });

        // 2. Extraire la DataURL du canvas ThreeJS principal via le renderer
        try {
            // Note: renderer.domElement.toDataURL() fonctionne si preserveDrawingBuffer est true 
            // ou si c'est appelé dans la meme boucle de rendu.
            // On demande à Engine de snaper sur le prochain frame.
            Events.emit('camera:request_screenshot');
        } catch (e) {
            console.error(e);
        }
    }
}
