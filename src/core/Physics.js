import * as CANNON from 'cannon-es';
import { PhysicsConfig } from '../utils/Constants.js';
import { Logger } from '../utils/Logger.js';
import { Events } from '../utils/Events.js';

/**
 * LIFE RPG - Moteur Physique Wrapper (Cannon-es)
 * Encapsule la création des mondes physiques, la gestion des matériaux
 * pour le frottement (Glace, Route, Herbe) et les Broadphases.
 */
class PhysicsEngine {
    constructor() {
        this.world = null;
        this.materials = {};
        this.contactMaterials = [];
        this.isInitialized = false;

        // Pour l'optimisation
        this.bodies = [];
    }

    /**
     * Initialise le World Cannon-es
     */
    init() {
        if (this.isInitialized) return;

        Logger.info('Physics', 'Initialisation du Moteur Physique (Cannon-es)...');

        this.world = new CANNON.World();

        // Gravité Globale (Earth-like)
        this.world.gravity.set(
            PhysicsConfig.GRAVITY[0],
            PhysicsConfig.GRAVITY[1],
            PhysicsConfig.GRAVITY[2]
        );

        // Algorithme de Broadphase (Sweep and Prune est excellent pour les open worlds plats)
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        // Si l'axe Y est up, on définit SAP axes à X et Z idéalement (défaut est OK).

        // Solving des contraintes
        this.world.solver.iterations = PhysicsConfig.ITERATIONS;
        this.world.solver.tolerance = PhysicsConfig.TOLERANCE;

        // Optimisations: les objets qui ne bougent pas "dorment"
        this.world.allowSleep = true;

        this._setupMaterials();

        this.isInitialized = true;
        Logger.info('Physics', 'Moteur Physique Prêt.');
    }

    /**
     * Prépare les matériaux physiques (Friction, Bounciness)
     */
    _setupMaterials() {
        // Matériel par défaut pour le world entier (fallback)
        this.materials.default = new CANNON.Material('default');

        // Matériaux Spécifiques
        this.materials.player = new CANNON.Material('player');
        this.materials.vehicle = new CANNON.Material('vehicle');
        this.materials.ice = new CANNON.Material('ice');
        this.materials.bouncy = new CANNON.Material('bouncy');
        this.materials.dirt = new CANNON.Material('dirt');

        // Création des interactions (ContactMaterials)
        // Defaut X Defaut
        const defMat = PhysicsConfig.MATERIALS.DEFAULT;
        const defaultContact = new CANNON.ContactMaterial(
            this.materials.default, this.materials.default,
            { friction: defMat.friction, restitution: defMat.restitution }
        );
        this.world.addContactMaterial(defaultContact);

        // Player X World (La friction est gérée par le CharacterController, on veut donc qu'elle soit nulle sur les murs)
        const pMat = PhysicsConfig.MATERIALS.PLAYER;
        const playerContact = new CANNON.ContactMaterial(
            this.materials.player, this.materials.default,
            { friction: pMat.friction, restitution: pMat.restitution }
        );
        this.world.addContactMaterial(playerContact);

        // Véhicule X Route (High friction pour pas glisser de ouf)
        const vMat = PhysicsConfig.MATERIALS.VEHICLE;
        const vehicleContact = new CANNON.ContactMaterial(
            this.materials.vehicle, this.materials.default,
            { friction: vMat.friction, restitution: vMat.restitution }
        );
        this.world.addContactMaterial(vehicleContact);
    }

    /**
     * La fonction Update appelée par la GameLoop (Fixed Tick)
     * @param {number} fixedDelta timeStep configuration
     */
    update(fixedDelta) {
        if (!this.world || !this.isInitialized) return;

        // Note: On ne passe pas la logique de "substeps" (Spiral of Death) ici
        // car GameLoop le fait SÛREMENT avec sa propre boucle `while(accum >= delta)`.
        // Donc on avance simplement de `fixedDelta`.
        this.world.step(fixedDelta);
    }

    /**
     * Helper pour ajouter un Body au monde
     * @param {CANNON.Body} body 
     */
    addBody(body) {
        if (!this.world) return;
        this.world.addBody(body);
        this.bodies.push(body);
    }

    /**
     * Helper pour retirer un Body du monde proprement
     * @param {CANNON.Body} body 
     */
    removeBody(body) {
        if (!this.world) return;
        this.world.removeBody(body);
        const index = this.bodies.indexOf(body);
        if (index > -1) {
            this.bodies.splice(index, 1);
        }
    }

    /**
     * Lance un rayon de physique (ex: balles (hitscan), ligne de vue IA)
     * @param {CANNON.Vec3} start 
     * @param {CANNON.Vec3} end 
     * @param {object} options { collisionFilterGroup, collisionFilterMask, skipBackfaces }
     * @returns {CANNON.RaycastResult|null}
     */
    raycast(start, end, options = {}) {
        const result = new CANNON.RaycastResult();
        const ray = new CANNON.Ray(start, end);

        let mode = CANNON.Ray.CLOSEST; // default

        if (options.collisionFilterGroup !== undefined) ray.collisionFilterGroup = options.collisionFilterGroup;
        if (options.collisionFilterMask !== undefined) ray.collisionFilterMask = options.collisionFilterMask;
        if (options.skipBackfaces !== undefined) ray.skipBackfaces = options.skipBackfaces;

        const hasHit = ray.intersectWorld(this.world, result);

        return hasHit ? result : null;
    }

    /**
     * Outil utile (Raycast All)
     * Récupère tous les objets touchés par le rayon
     */
    raycastAll(start, end, options = {}) {
        const result = [];
        const callback = (hit) => {
            // Fait une copie du hit result car Cannon réutilise le même objet par la suite
            result.push({
                body: hit.body,
                shape: hit.shape,
                point: new CANNON.Vec3().copy(hit.hitPointWorld),
                normal: new CANNON.Vec3().copy(hit.hitNormalWorld),
                distance: hit.distance
            });
        };

        const ray = new CANNON.Ray(start, end);
        ray.callback = callback;
        ray.intersectWorld(this.world, { mode: CANNON.Ray.ALL });

        return result;
    }

    /**
     * Nettoyage du monde lors d'un restart ou zone reloading
     */
    clear() {
        Logger.info('Physics', "Nettoyage du Physics World.");
        for (let body of this.bodies) {
            this.world.removeBody(body);
        }
        this.bodies = [];
    }
}

export const Physics = new PhysicsEngine();
