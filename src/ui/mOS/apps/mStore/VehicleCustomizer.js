/**
 * VehicleCustomizer.js
 * 
 * Interactive UI module for tuning performance and aesthetics of owned vehicles.
 * Integrates directly with the 3D scene.
 */

export class VehicleCustomizer {
    constructor(worldManager, saveSystem) {
        this.worldManager = worldManager;
        this.saveSystem = saveSystem;
        this.activeVehicle = null;
    }

    openCustomizer(vehicleEntityId) {
        const veh = this.worldManager.getEntity(vehicleEntityId);
        if (!veh || veh.type !== 'vehicle') return;

        this.activeVehicle = veh;
        this.renderUI();

        // Switch camera to garage view
        dispatchEvent(new CustomEvent('CameraModeChange', { detail: { mode: 'garage', target: veh } }));
    }

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'vehicle-customizer-ui';
        overlay.className = 'layer-glass customizer-panel';

        overlay.innerHTML = `
            <h3>Garage: ${this.activeVehicle.name}</h3>
            
            <div class="mod-category">
                <label>Paint Job</label>
                <div class="color-picker-mock">
                    <button style="background:red" onclick="window.vCustomizer.changeColor('#ff0000')"></button>
                    <button style="background:black" onclick="window.vCustomizer.changeColor('#000000')"></button>
                    <button style="background:blue" onclick="window.vCustomizer.changeColor('#0000ff')"></button>
                </div>
            </div>
            
            <div class="mod-category">
                <label>Engine ECU Tune (5,000 mCoins)</label>
                <button class="btn-upgrade" onclick="window.vCustomizer.upgradeEngine()">Stage 1 Tune</button>
            </div>
            
            <button class="btn-close" onclick="window.vCustomizer.closeCustomizer()">Exit Garage</button>
        `;

        document.body.appendChild(overlay);
        window.vCustomizer = this;
    }

    changeColor(hexString) {
        console.log(`[VehicleCustomizer] Applying color ${hexString}`);
        if (this.activeVehicle && this.activeVehicle.visualSystem) {
            this.activeVehicle.visualSystem.setPaintColor(hexString);

            // Save state
            let mods = this.saveSystem.getState(`veh_${this.activeVehicle.id}_mods`) || {};
            mods.color = hexString;
            this.saveSystem.setState(`veh_${this.activeVehicle.id}_mods`, mods);
        }
    }

    upgradeEngine() {
        // Validation check against mCoins logic would go here

        console.log(`[VehicleCustomizer] Engine upgraded for ${this.activeVehicle.id}`);
        if (this.activeVehicle && this.activeVehicle.physicsSystem) {
            this.activeVehicle.physicsSystem.maxEngineForce *= 1.2;
        }
    }

    closeCustomizer() {
        const overlay = document.getElementById('vehicle-customizer-ui');
        if (overlay) overlay.remove();

        // Switch camera back to player
        dispatchEvent(new CustomEvent('CameraModeChange', { detail: { mode: 'follow' } }));
    }
}
