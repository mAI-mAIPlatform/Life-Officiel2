export class HomeAutomation {
    constructor(worldManager, apartmentId) {
        this.worldManager = worldManager;
        this.apartmentId = apartmentId;
        this.systemsOnline = true;

        this.settings = {
            lights: true,
            blinds: "OPEN",
            temperature: 22,
            music: false
        };
    }

    hackSystem() {
        this.systemsOnline = !this.systemsOnline;
        console.log(`Domotics for appt ${this.apartmentId} hacked. Oline: ${this.systemsOnline}`);
        this.worldManager.executeWorldImpact('apartment_blackout');

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Contrôle domotique outrepassé. Vous pouvez aveugler les caméras ou surcharger le thermostat.");
        }
    }

    setLights(state) {
        if (!this.systemsOnline) return "SYSTEM OFFLINE";
        this.settings.lights = state;
        // Update light entities
    }

    setBlinds(state) {
        if (!this.systemsOnline) return "SYSTEM OFFLINE";
        this.settings.blinds = state;
        // Trigger animations
    }

    overloadThermostat() {
        if (!this.systemsOnline) return "SYSTEM OFFLINE";
        this.settings.temperature = 50;
        this.worldManager.triggerGlobalEvent("fire_alarm", { location: this.apartmentId });

        if (this.worldManager.ui) {
            this.worldManager.ui.triggerMAI("Thermostat surchargé. Alarme incendie déclenchée, le bâtiment va être évacué.");
        }
    }
}
