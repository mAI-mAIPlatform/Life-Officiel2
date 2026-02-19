// @ts-nocheck
import RAPIER, { World, EventQueue, RigidBodyDesc, ColliderDesc, Vector3 as RapierVector3 } from '@dimforge/rapier3d-compat';
import { Vector3, Quaternion } from 'three';

/**
 * LOW-LEVEL PHYSICS MANAGER
 * Wraps Rapier3D functionality for decoupled execution.
 */
export class PhysicsSystem {
  public world!: World;
  private eventQueue!: EventQueue;
  public initialized: boolean = false;

  constructor() {}

  /**
   * Initialize WASM and World.
   */
  async init() {
    if (this.initialized) return;

    await RAPIER.init();

    // Standard gravity
    const gravity = new RapierVector3(0.0, -9.81, 0.0);
    // Explicitly using the class
    this.world = new World(gravity);
    this.eventQueue = new EventQueue();

    this.initialized = true;
    console.log("[PhysicsSystem] Rapier Initialized (WASM)");
  }

  /**
   * Advances the simulation by one tick.
   * Assumed to be called at fixed intervals (e.g. 60Hz).
   */
  step() {
    if (!this.initialized) return;

    this.world.step(this.eventQueue);

    // In a full implementation, we would drain events here and push to a queue for the ECS to consume.
    this.eventQueue.drainCollisionEvents((_handle1, _handle2, _started) => {
        // Placeholder: Log collision or buffer it
        // console.log(`Collision: ${handle1} <-> ${handle2} (${started})`);
    });
  }

  /**
   * Factory: Create RigidBody
   */
  createBody(
      pos: Vector3,
      rot: Quaternion,
      type: 'dynamic' | 'fixed' | 'kinematicPosition' | 'kinematicVelocity',
      _mass: number = 1.0,
      damping: number = 0.0
  ): RAPIER.RigidBody {
      let desc: RigidBodyDesc;

      switch(type) {
          case 'dynamic':
              desc = RigidBodyDesc.dynamic();
              break;
          case 'fixed':
              desc = RigidBodyDesc.fixed();
              break;
          case 'kinematicPosition':
              desc = RigidBodyDesc.kinematicPositionBased();
              break;
          case 'kinematicVelocity':
              desc = RigidBodyDesc.kinematicVelocityBased();
              break;
          default:
              desc = RigidBodyDesc.dynamic();
      }

      desc.setTranslation(pos.x, pos.y, pos.z);
      desc.setRotation({x: rot.x, y: rot.y, z: rot.z, w: rot.w});
      desc.setLinearDamping(damping);
      // Mass is set via collider usually in Rapier, or explicit mass props,
      // but dynamic bodies calculate mass from colliders by default unless overridden.
      // desc.setAdditionalMass(mass); // Simplified

      return this.world.createRigidBody(desc);
  }

  /**
   * Factory: Create Collider
   */
  createCollider(
      body: RAPIER.RigidBody,
      shape: 'cuboid' | 'ball' | 'capsule',
      args: number[],
      friction: number = 0.5,
      restitution: number = 0.0,
      sensor: boolean = false
  ): RAPIER.Collider {
      let colliderDesc: ColliderDesc;

      switch(shape) {
          case 'cuboid':
            // args: [halfX, halfY, halfZ]
            colliderDesc = ColliderDesc.cuboid(args[0], args[1], args[2]);
            break;
          case 'ball':
            // args: [radius]
            colliderDesc = ColliderDesc.ball(args[0]);
            break;
          case 'capsule':
             // args: [halfHeight, radius]
            colliderDesc = ColliderDesc.capsule(args[0], args[1]);
            break;
          default:
            colliderDesc = ColliderDesc.ball(1);
      }

      colliderDesc.setFriction(friction);
      colliderDesc.setRestitution(restitution);
      colliderDesc.setSensor(sensor);

      return this.world.createCollider(colliderDesc, body);
  }

  /**
   * Clean up
   */
  removeBody(body: RAPIER.RigidBody) {
      this.world.removeRigidBody(body);
  }
}

export const physicsSystem = new PhysicsSystem();
