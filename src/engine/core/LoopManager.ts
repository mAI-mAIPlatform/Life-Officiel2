import { physicsSystem } from '../physics/PhysicsSystem';

type UpdateCallback = (dt: number) => void;
type RenderCallback = (alpha: number) => void;

/**
 * GAME LOOP MANAGER
 * Implements a decoupled loop with fixed timestep for physics/logic
 * and variable timestep for rendering.
 */
export class LoopManager {
  private accumulator: number = 0;
  private readonly fixedTimeStep: number = 1 / 60;
  private readonly maxFrameTime: number = 0.1; // 100ms max to prevent spiral of death

  private fixedUpdateCallbacks: UpdateCallback[] = [];
  private renderCallbacks: RenderCallback[] = [];

  private isPaused: boolean = false;

  constructor() {
      console.log("[LoopManager] Initialized");
  }

  /**
   * Register a callback for the Fixed Update loop (60Hz).
   * Used for AI, Gameplay Logic, State Updates.
   */
  public registerFixedUpdate(cb: UpdateCallback) {
      this.fixedUpdateCallbacks.push(cb);
  }

  /**
   * Register a callback for the Render loop (every frame).
   * Used for interpolation and visual updates.
   * @param alpha Interpolation factor [0, 1] between two fixed updates.
   */
  public registerRender(cb: RenderCallback) {
      this.renderCallbacks.push(cb);
  }

  public pause() {
      this.isPaused = true;
  }

  public resume() {
      this.isPaused = false;
      this.accumulator = 0; // Reset accumulator to avoid huge jump
  }

  /**
   * Main Tick Function.
   * Should be called by the R3F useFrame loop or requestAnimationFrame.
   * @param delta Time since last frame in seconds.
   */
  public tick(delta: number) {
    if (this.isPaused) return;

    // Clamp delta to avoid spiral of death on lag spikes
    let frameTime = delta;
    if (frameTime > this.maxFrameTime) frameTime = this.maxFrameTime;

    this.accumulator += frameTime;

    // Fixed Update Loop (Logic & Physics)
    // Runs multiple times if frameTime > fixedTimeStep
    while (this.accumulator >= this.fixedTimeStep) {
      // 1. Physics Step (Rapier)
      physicsSystem.step();

      // 2. Gameplay Logic Systems
      for (const cb of this.fixedUpdateCallbacks) {
          cb(this.fixedTimeStep);
      }

      this.accumulator -= this.fixedTimeStep;
    }

    // Interpolation factor
    const alpha = this.accumulator / this.fixedTimeStep;

    // Render / Interpolation Update
    for (const cb of this.renderCallbacks) {
        cb(alpha);
    }
  }
}

export const loopManager = new LoopManager();
