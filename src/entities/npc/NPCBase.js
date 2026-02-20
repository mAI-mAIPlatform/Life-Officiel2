import * as THREE from 'three';
import { Physics } from '../../core/Physics.js';
import { BrainAI } from './BrainAI.js';
import { Engine } from '../../core/Engine.js';

/**
 * LIFE RPG - NPC Base
 * Représente l'entité physique et graphique d'un PNJ dans le monde.
 * Délègue sa logique de décision à un composant `BrainAI`.
 */
export class NPCBase {
    constructor(id, type = 'civilian', position = new THREE.Vector3()) {
        this.id = id;
        this.type = type;

        this.mesh = null;
        this.body = null;

        // Cerveau (Machine à états)
        this.brain = new BrainAI(this);

        this.health = 100;
        this.isDead = false;

        this._spawn(position);
    }

    _spawn(pos) {
        // Visuel (Placeholder basique cylindre ou un mix de box pour faire un humanoide)
        const geo = new THREE.CylinderGeometry(0.4, 0.4, 1.8, 8);
        geo.translate(0, 0.9, 0); // Base au niveau des pieds

        // Couleur selon le type de PNJ
        let color = 0x888888;
        if (this.type === 'police') color = 0x0000ff;
        else if (this.type === 'gang') color = 0xff0000;
        else if (this.type === 'corpo') color = 0x222222;

        const mat = new THREE.MeshStandardMaterial({ color: color });
        this.mesh = new THREE.Mesh(geo, mat);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        Engine.scene.add(this.mesh);

        // Physique KCC (Kinematic Character Controller)
        const shape = new Physics.cannon.Cylinder(0.4, 0.4, 1.8, 8);
        // Rotation cylinder cannonJS car ils sont couchés par défaut
        const quat = new Physics.cannon.Quaternion();
        quat.setFromAxisAngle(new Physics.cannon.Vec3(1, 0, 0), -Math.PI / 2);

        this.body = new Physics.cannon.Body({
            mass: 70, // Humain moyen
            fixedRotation: true,
            position: new Physics.cannon.Vec3(pos.x, pos.y, pos.z)
        });

        this.body.addShape(shape, new Physics.cannon.Vec3(0, 0.9, 0), quat);
        Physics.world.addBody(this.body);
    }

    update(dt) {
        if (this.isDead) return;

        // Le cerveau détermine la vitesse cible et la rotation
        this.brain.update(dt);

        // Sync Physique vers Mesh
        this.mesh.position.copy(this.body.position);

        // Rotation visuelle uniquement (Le body cannon physique ne tourne pas en Y pour un KCC)
        // La rotation visuelle est gérée dans le BrainAI ou ici selon la vélocité
        if (this.body.velocity.lengthSq() > 0.1) {
            const angle = Math.atan2(this.body.velocity.x, this.body.velocity.z);
            // Smooth rotation factice (Lerp)
            this.mesh.rotation.y = angle;
        }
    }

    applyDamage(amount) {
        if (this.isDead) return;
        this.health -= amount;

        if (this.health <= 0) {
            this.die();
        } else {
            this.brain.onDamaged(); // Alerter le cerveau (Fuite ou Contre-attaque)
        }
    }

    die() {
        this.isDead = true;
        // Effet ragdoll trivial : Le body tombe
        this.body.fixedRotation = false;
        // Retire la contrainte de rester debout, le perso s'écroule physiquement.
        // TODO: Déclencher Event pour lacher loot / alerter police
    }

    destroy() {
        Engine.scene.remove(this.mesh);
        Physics.world.removeBody(this.body);
        // Libérer la ram (Mats/Geos pouraient être partagés mais en l'état)
    }
}
