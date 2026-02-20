import './work_suite_glass.css';

export class mWork_Hub {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.isActive = false;
        this.element = null;
        this.availableJobs = [
            { id: "dev", title: "mDeveloper", pay: "3000 C/job", risk: "Low" },
            { id: "cop", title: "Officier NCPD", pay: "500 C/arrest", risk: "High" },
            { id: "medic", title: "Trauma Team", pay: "800 C/patient", risk: "Medium" },
            { id: "realestate", title: "Agent Immobilier", pay: "5% comm.", risk: "Low" }
        ];
    }

    render() {
        this.element = document.createElement('div');
        this.element.className = 'mos-app mwork-hub glass-panel';

        const header = document.createElement('div');
        header.className = 'app-header';
        header.innerHTML = '<h2>mWork Hub</h2><p>Trouvez votre prochaine carrière à NeoCity</p>';

        const list = document.createElement('ul');
        list.className = 'job-list';

        this.availableJobs.forEach(job => {
            const li = document.createElement('li');
            li.className = 'job-item glass-card';
            li.innerHTML = `
                <h3>${job.title}</h3>
                <span class="pay-rate">${job.pay}</span>
                <span class="risk-level risk-${job.risk.toLowerCase()}">Risque: ${job.risk}</span>
                <button class="apply-btn" data-job="${job.id}">Postuler</button>
            `;
            list.appendChild(li);
        });

        this.element.appendChild(header);
        this.element.appendChild(list);
        this.bindEvents();
        return this.element;
    }

    bindEvents() {
        const btns = this.element.querySelectorAll('.apply-btn');
        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job');
                this.applyForJob(jobId);
            });
        });
    }

    applyForJob(jobId) {
        console.log(`Applying for ${jobId}...`);
        this.uiManager.triggerMAI(`Candidature envoyée pour le poste ID: ${jobId}. L'algorithme d'embauche de mServices analyse votre profil criminel...`);

        setTimeout(() => {
            this.uiManager.triggerMAI("Félicitations, vous êtes embauché. Prise de fonction immédiate requise.");
            // Notify career systems
        }, 2000);
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
