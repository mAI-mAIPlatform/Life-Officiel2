import './work_suite_glass.css';

export class mMarket_Seller {
    constructor(uiManager, playerData) {
        this.uiManager = uiManager;
        this.playerData = playerData;
        this.isActive = false;
        this.element = null;
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'mos-app mmarket-seller glass-panel';

        const header = document.createElement('div');
        header.className = 'app-header';
        header.innerHTML = '<h2>mMarket - Terminal Vendeur</h2><p>Gérez votre inventaire et vos ventes crypto</p>';

        const stockSection = document.createElement('div');
        stockSection.className = 'stock-section glass-card';
        stockSection.innerHTML = `
            <h3>Inventaire Actuel</h3>
            <ul>
                <li><strong>Composants Cyber (Grade B):</strong> 14 unités</li>
                <li><strong>Modules Optiques:</strong> 3 unités</li>
                <li><strong>Cartes Mémoires Décryptées:</strong> 7 unités</li>
            </ul>
        `;

        const salesButton = document.createElement('button');
        salesButton.className = 'publish-btn';
        salesButton.innerText = "Publier Offres sur le Net";
        salesButton.onclick = () => this.publishListings();

        this.element.appendChild(header);
        this.element.appendChild(stockSection);
        this.element.appendChild(salesButton);
        return this.element;
    }

    publishListings() {
        this.uiManager.triggerMAI("Annonces publiées sur le marché gris de NeoCity. Attendez-vous à des offres de la part d'acheteurs de divers gangs ou corpos.");
        // Logic to trigger sales events...
    }

    open() {
        this.isActive = true;
        this.render();
    }

    close() {
        this.isActive = false;
        if (this.element) this.element.remove();
    }
}
