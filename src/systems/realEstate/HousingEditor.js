import * as THREE from 'three';
import { Events } from '../../utils/Events.js';
import { Engine } from '../../core/Engine.js';

/**
 * LIFE RPG - Housing Editor
 * Permet de placer / déplacer / tourner des meubles dans 
 * la propriété active du joueur (Style The Sims light).
 */
class InteriorDecorator {
    constructor() {
        this.isEditing = false;

        this.placedItems = [];
        this.furnitureCatalog = [
            { id: 'f_bed_01', name: 'Cheap Cot', price: 200, category: 'Bed' },
            { id: 'f_couch_01', name: 'Neon Sofa', price: 800, category: 'Seating' },
            { id: 'f_tv_01', name: 'Holo-Screen', price: 1500, category: 'Electronics' }
        ];

        this.selectedItemMesh = null; // L'item tenu en ce moment

        // Raycaster pour poser les meubles sur le sol
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    init() {
        // En vrai: bind click events pour placer
    }

    startEditing() {
        this.isEditing = true;
        Events.emit('ui:show_housing_menu', this.furnitureCatalog);
        // Change Camera to Top-Down Orthographic or Free-cam
    }

    stopEditing() {
        this.isEditing = false;
        Events.emit('ui:hide_housing_menu');
        this._cancelPlacement();
        // Camera back to Player
    }

    // --- Placement Flow ---

    selectFromCatalog(itemId) {
        const itemInfo = this.furnitureCatalog.find(i => i.id === itemId);
        if (!itemInfo) return;

        // Cree un mesh fantome translucide
        const geo = new THREE.BoxGeometry(1, 1, 2); // Mock geometry
        const mat = new THREE.MeshStandardMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        this.selectedItemMesh = new THREE.Mesh(geo, mat);

        Engine.scene.add(this.selectedItemMesh);
    }

    updateGhostPosition(screenX, screenY, camera, floorMeshes) {
        if (!this.selectedItemMesh) return;

        // Raycast de la souris vers le sol
        this.mouse.x = (screenX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(screenY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, camera);

        const intersects = this.raycaster.intersectObjects(floorMeshes);
        if (intersects.length > 0) {
            this.selectedItemMesh.position.copy(intersects[0].point);
            this.selectedItemMesh.position.y += 0.5; // Offset half size

            // Check collisions with other furnitures -> Turn red if colliding
            // this.selectedItemMesh.material.color.setHex(0xff0000);
        }
    }

    rotateSelectedItem() {
        if (this.selectedItemMesh) {
            this.selectedItemMesh.rotation.y += Math.PI / 4; // 45 degres
        }
    }

    confirmPlacement() {
        if (!this.selectedItemMesh) return;

        // TODO: Retirer prix de Player.money

        // Rendre solide
        this.selectedItemMesh.material.transparent = false;
        this.selectedItemMesh.material.opacity = 1.0;
        this.selectedItemMesh.material.color.setHex(0xaaaaaa);

        // Ajout Physic body CannonJS statique ici...

        this.placedItems.push(this.selectedItemMesh);
        this.selectedItemMesh = null;
    }

    _cancelPlacement() {
        if (this.selectedItemMesh) {
            Engine.scene.remove(this.selectedItemMesh);
            this.selectedItemMesh = null;
        }
    }
}

export const HousingEditor = new InteriorDecorator();
