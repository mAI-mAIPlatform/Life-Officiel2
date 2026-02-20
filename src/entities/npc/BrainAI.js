import * as THREE from 'three';

/**
 * LIFE RPG - Brain AI
 * Machine à états finis (FSM) pour les comportements des PNJ.
 */
export class BrainAI {
    constructor(npc) {
        this.npc = npc;
        this.currentState = 'WANDER';

        this.walkSpeed = 2.0;
        this.runSpeed = 6.0;

        // WANDER Navigation
        this.targetPoint = new THREE.Vector3();
        this.timeInState = 0;

        this._pickNewWanderPoint();
    }

    update(dt) {
        this.timeInState += dt;

        switch (this.currentState) {
            case 'IDLE':
                this._handleIdle(dt);
                break;
            case 'WANDER':
                this._handleWander(dt);
                break;
            case 'FLEE':
                this._handleFlee(dt);
                break;
            case 'COMBAT':
                this._handleCombat(dt);
                break;
        }
    }

    _handleIdle(dt) {
        // Freinage
        this.npc.body.velocity.x *= 0.9;
        this.npc.body.velocity.z *= 0.9;

        if (this.timeInState > 3.0 + Math.random() * 5.0) {
            this.setState('WANDER');
        }
    }

    _handleWander(dt) {
        // Calcul du vecteur direction
        const pos = this.npc.body.position;
        const dx = this.targetPoint.x - pos.x;
        const dz = this.targetPoint.z - pos.z;
        const distSq = dx * dx + dz * dz;

        // Arrivé ?
        if (distSq < 1.0) {
            this.setState('IDLE');
            return;
        }

        // Normalize & Appliquer Vitesse
        const dist = Math.sqrt(distSq);
        const dirX = dx / dist;
        const dirZ = dz / dist;

        // Mouvement cinématique simple
        this.npc.body.velocity.x = dirX * this.walkSpeed;
        this.npc.body.velocity.z = dirZ * this.walkSpeed;

        // Bloqué pendant trop longtemps ?
        if (this.timeInState > 15.0) {
            this.setState('IDLE');
        }
    }

    _handleFlee(dt) {
        // Cours loin de la menace (WIP simplifié)
        this.npc.body.velocity.x = Math.sin(this.timeInState) * this.runSpeed;
        this.npc.body.velocity.z = Math.cos(this.timeInState) * this.runSpeed;

        if (this.timeInState > 10.0) {
            this.setState('WANDER'); // Sécurité présumée
        }
    }

    _handleCombat(dt) {
        // Logique de tir ou corps à corps basique
        this.npc.body.velocity.x *= 0.5; // Statique pour tirer
        this.npc.body.velocity.z *= 0.5;
    }

    _pickNewWanderPoint() {
        const radius = 20;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;

        // Raycast / NavMesh idéalement. Ici on navigue au hasard
        this.targetPoint.set(
            this.npc.body.position.x + Math.cos(angle) * r,
            this.npc.body.position.y,
            this.npc.body.position.z + Math.sin(angle) * r
        );
    }

    setState(newState) {
        if (this.currentState === newState) return;
        this.currentState = newState;
        this.timeInState = 0;

        if (newState === 'WANDER') {
            this._pickNewWanderPoint();
        }
    }

    onDamaged() {
        // Réaction selon le type de PNJ
        if (this.npc.type === 'civilian' || this.npc.type === 'corpo') {
            this.setState('FLEE');
        } else {
            this.setState('COMBAT');
        }
    }
}
